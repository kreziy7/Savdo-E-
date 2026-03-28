const Sale = require('../models/Sale.model');
const Product = require('../models/Product.model');
const ApiError = require('../utils/ApiError');

const createSale = async (userId, saleData) => {
  const { product: productId, productName, quantity, sellPrice, buyPrice, unit, note, syncId, isFromOffline, createdAt } = saleData;

  // Check for duplicate syncId (idempotent offline sync)
  if (syncId) {
    const existing = await Sale.findOne({ syncId });
    if (existing) return existing;
  }

  // Deduct stock if product reference is given
  if (productId) {
    const product = await Product.findById(productId);
    if (product) {
      if (product.stock < quantity) {
        throw new ApiError(400, `Insufficient stock for "${product.name}". Available: ${product.stock}`);
      }
      product.stock -= quantity;
      await product.save({ validateBeforeSave: false });
    }
  }

  const saleDoc = new Sale({
    user: userId,
    product: productId || undefined,
    productName,
    quantity,
    sellPrice,
    buyPrice,
    unit,
    note,
    syncId,
    isFromOffline: isFromOffline || false,
  });

  if (createdAt) saleDoc.createdAt = new Date(createdAt);

  await saleDoc.save();
  return saleDoc;
};

const bulkSync = async (userId, sales) => {
  const results = [];
  for (const s of sales) {
    try {
      const sale = await createSale(userId, s);
      results.push({ syncId: s.syncId, serverId: sale._id, status: 'synced' });
    } catch (err) {
      results.push({ syncId: s.syncId, status: 'failed', error: err.message });
    }
  }
  return results;
};

const getSales = async (userId, { page = 1, limit = 20, from, to } = {}) => {
  const filter = { user: userId };
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [sales, total] = await Promise.all([
    Sale.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Sale.countDocuments(filter),
  ]);

  return { sales, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

module.exports = { createSale, bulkSync, getSales };
