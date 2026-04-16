const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User.model');
const RefreshToken = require('../models/RefreshToken.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({ name, email, password });
  return user;
};

/**
 * Login user and return tokens
 */
const login = async ({ email, password }, meta = {}) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'Your account has been blocked');
  }

  const tokenPayload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshTokenValue = generateRefreshToken(tokenPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  await RefreshToken.create({
    user: user._id,
    token: refreshTokenValue,
    expiresAt,
    userAgent: meta.userAgent || '',
    ip: meta.ip || '',
  });

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken: refreshTokenValue };
};

/**
 * Rotate refresh token
 */
const refreshTokens = async (incomingRefreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const storedToken = await RefreshToken.findOne({
    token: incomingRefreshToken,
    isRevoked: false,
  });

  if (!storedToken) {
    throw new ApiError(401, 'Refresh token not found or already revoked');
  }

  if (storedToken.expiresAt < new Date()) {
    await storedToken.deleteOne();
    throw new ApiError(401, 'Refresh token expired');
  }

  // Revoke old token
  storedToken.isRevoked = true;
  await storedToken.save();

  const user = await User.findById(decoded.id);
  if (!user || user.isBlocked) {
    throw new ApiError(401, 'User not found or blocked');
  }

  const tokenPayload = { id: user._id, role: user.role };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  await RefreshToken.create({
    user: user._id,
    token: newRefreshToken,
    expiresAt,
    userAgent: storedToken.userAgent,
    ip: storedToken.ip,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * Logout — revoke specific refresh token
 */
const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
};

/**
 * Logout all sessions for a user
 */
const logoutAll = async (userId) => {
  await RefreshToken.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });
};

/**
 * Forgot password — generate reset token, send email
 */
const forgotPassword = async (email, resetBaseUrl) => {
  const user = await User.findOne({ email });
  // Always return success to prevent email enumeration
  if (!user) return;

  // Generate raw token (sent to user) and hashed token (stored in DB)
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 daqiqa
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${resetBaseUrl}/reset-password?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Savdo-E — Parolni tiklash',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;">
        <h2 style="color:#1a1a2e;">Parolni tiklash</h2>
        <p>Salom, <strong>${user.name}</strong>!</p>
        <p>Parolni tiklash uchun quyidagi tugmani bosing:</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;
                  border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Parolni tiklash
        </a>
        <p style="color:#888;font-size:13px;">Havola 15 daqiqa ichida amal qiladi.</p>
        <p style="color:#888;font-size:13px;">Agar siz bu so'rovni yubormagan bo'lsangiz, e'tibor bermang.</p>
      </div>
    `,
  });
};

/**
 * Reset password — verify token, update password
 */
const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw new ApiError(400, 'Token yaroqsiz yoki muddati tugagan');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Revoke all sessions after password change
  await RefreshToken.updateMany({ user: user._id, isRevoked: false }, { isRevoked: true });
};

/**
 * Google OAuth — verify ID token, find or create user, return JWT tokens
 */
const googleAuth = async (credential, meta = {}) => {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError(401, 'Google token yaroqsiz');
  }

  const { sub: googleId, email, name, picture } = payload;

  // Mavjud user topamiz (googleId yoki email orqali)
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    // Yangi user yaratamiz
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      googleId,
      avatar: picture || null,
      isEmailVerified: true,
    });
  } else {
    // Mavjud userga googleId ulash (email bilan ro'yxatdan o'tgan bo'lsa)
    let changed = false;
    if (!user.googleId) { user.googleId = googleId; changed = true; }
    if (!user.isEmailVerified) { user.isEmailVerified = true; changed = true; }
    if (!user.avatar && picture) { user.avatar = picture; changed = true; }
    if (changed) await user.save({ validateBeforeSave: false });
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'Hisobingiz bloklangan');
  }

  const tokenPayload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshTokenValue = generateRefreshToken(tokenPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  await RefreshToken.create({
    user: user._id,
    token: refreshTokenValue,
    expiresAt,
    userAgent: meta.userAgent || '',
    ip: meta.ip || '',
  });

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken: refreshTokenValue };
};

module.exports = { register, login, refreshTokens, logout, logoutAll, forgotPassword, resetPassword, googleAuth };
