const User = require('../models/User.model');
const RefreshToken = require('../models/RefreshToken.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

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

module.exports = { register, login, refreshTokens, logout, logoutAll };
