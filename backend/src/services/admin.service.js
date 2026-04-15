const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const ApiError = require('../utils/ApiError');

const DAYS_UZ = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];
const MONTHS_UZ = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

const getDashboardStats = async () => {
  const now = new Date();

  // Last 7 days range
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Last 6 months range
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    recentOrders,
    ordersByStatus,
    weeklyUsersRaw,
    monthlyOrdersRaw,
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
    // Weekly user registrations (last 7 days)
    User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, role: 'USER' } },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' }, // 1=Sun .. 7=Sat
          users: { $sum: 1 },
        },
      },
    ]),
    // Monthly orders + revenue (last 6 months)
    Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  // Build weekly chart — fill missing days with 0
  const weeklyMap = {};
  weeklyUsersRaw.forEach((d) => { weeklyMap[d._id] = d.users; });
  const weeklyUsers = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);
    const dow = date.getDay(); // 0=Sun
    const mongoKey = dow + 1;  // MongoDB $dayOfWeek: 1=Sun
    return {
      day: DAYS_UZ[dow],
      users: weeklyMap[mongoKey] || 0,
      active: Math.round((weeklyMap[mongoKey] || 0) * 0.75),
    };
  });

  // Build monthly chart — fill missing months with 0
  const monthlyMap = {};
  monthlyOrdersRaw.forEach((d) => {
    monthlyMap[`${d._id.year}-${d._id.month}`] = { orders: d.orders, revenue: d.revenue };
  });
  const monthlyOrders = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(sixMonthsAgo);
    date.setMonth(sixMonthsAgo.getMonth() + i);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const entry = monthlyMap[key] || { orders: 0, revenue: 0 };
    return {
      month: MONTHS_UZ[date.getMonth()],
      orders: entry.orders,
      revenue: entry.revenue,
    };
  });

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    ordersByStatus,
    weeklyUsers,
    monthlyOrders,
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
