const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const ApiError = require('../utils/ApiError');

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    User.countDocuments({ role: 'USER' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email'),
    Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    ordersByStatus,
  };
};

const getAllUsers = async ({ page = 1, limit = 20, search, role } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) filter.role = role;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const blockUser = async (userId, adminId) => {
  if (userId.toString() === adminId.toString()) {
    throw new ApiError(400, 'You cannot block yourself');
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const unblockUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const deleteUser = async (userId, adminId) => {
  if (userId.toString() === adminId.toString()) {
    throw new ApiError(400, 'You cannot delete yourself');
  }
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return { message: 'User deleted successfully' };
};

const getAllOrders = async ({ page = 1, limit = 20, status } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {};
  if (status) filter.orderStatus = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  return { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

// ── Admin Registration ─────────────────────────────────────────────────────

const registerSuperAdmin = async ({ name, email, password, setupKey }) => {
  if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
    throw new ApiError(403, 'Invalid setup key');
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password, role: 'SUPER_ADMIN' });
  return user;
};

const registerAdmin = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password, role: 'ADMIN' });
  return user;
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  getAllOrders,
  registerSuperAdmin,
  registerAdmin,
};
