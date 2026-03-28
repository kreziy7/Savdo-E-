const Sale = require('../models/Sale.model');
const Product = require('../models/Product.model');

/**
 * Build a date range for a given day
 */
const dayRange = (dateStr) => {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * Build a date range for a given month (YYYY-MM)
 */
const monthRange = (yearMonth) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
};

const aggregateSales = async (userId, startDate, endDate) => {
  const result = await Sale.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalRevenue' },
        totalCost: { $sum: '$totalCost' },
        totalProfit: { $sum: '$profit' },
        salesCount: { $sum: 1 },
        avgProfit: { $avg: '$profit' },
      },
    },
  ]);

  return result[0] || {
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    salesCount: 0,
    avgProfit: 0,
  };
};

const topProducts = async (userId, startDate, endDate, limit = 5) => {
  return Sale.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$productName',
        totalProfit: { $sum: '$profit' },
        totalRevenue: { $sum: '$totalRevenue' },
        salesCount: { $sum: 1 },
        totalQty: { $sum: '$quantity' },
      },
    },
    { $sort: { totalProfit: -1 } },
    { $limit: limit },
  ]);
};

const getDailyReport = async (userId, dateStr) => {
  const { start, end } = dayRange(dateStr || new Date().toISOString().slice(0, 10));
  const [stats, products, hourlySales] = await Promise.all([
    aggregateSales(userId, start, end),
    topProducts(userId, start, end),
    // Hourly breakdown
    Sale.aggregate([
      { $match: { user: userId, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          revenue: { $sum: '$totalRevenue' },
          profit: { $sum: '$profit' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]),
  ]);

  return { date: dateStr, stats, topProducts: products, hourlySales };
};

const getMonthlyReport = async (userId, yearMonth) => {
  const ym = yearMonth || new Date().toISOString().slice(0, 7);
  const { start, end } = monthRange(ym);

  const [stats, products, dailySales] = await Promise.all([
    aggregateSales(userId, start, end),
    topProducts(userId, start, end, 10),
    // Daily breakdown for the month
    Sale.aggregate([
      { $match: { user: userId, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalRevenue' },
          profit: { $sum: '$profit' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]),
  ]);

  return { month: ym, stats, topProducts: products, dailySales };
};

const getSummary = async (userId) => {
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = new Date().toISOString().slice(0, 7);

  const [todayStats, monthStats, allTimeStats, lowStock] = await Promise.all([
    aggregateSales(userId, ...Object.values(dayRange(today))),
    aggregateSales(userId, ...Object.values(monthRange(thisMonth))),
    aggregateSales(userId, new Date(0), new Date()),
    Product.find({ stock: { $lte: 5 }, isActive: true })
      .select('name stock')
      .sort({ stock: 1 })
      .limit(10),
  ]);

  return { today: todayStats, thisMonth: monthStats, allTime: allTimeStats, lowStock };
};

module.exports = { getDailyReport, getMonthlyReport, getSummary };
