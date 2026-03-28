const Product = require('../models/Product.model');
const ApiError = require('../utils/ApiError');

const buildProductQuery = (queryParams) => {
  const { search, category, minPrice, maxPrice, minRating, inStock } = queryParams;
  const filter = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category.toLowerCase();
  }
  if (minPrice || maxPrice) {
    filter.finalPrice = {};
    if (minPrice) filter.finalPrice.$gte = Number(minPrice);
    if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
  }
  if (minRating) {
    filter['rating.average'] = { $gte: Number(minRating) };
  }
  if (inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  return filter;
};

const getProducts = async (queryParams) => {
  const {
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    order = 'desc',
  } = queryParams;

  const filter = buildProductQuery(queryParams);
  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const allowedSortFields = ['price', 'finalPrice', 'createdAt', 'rating.average', 'name'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .select('-reviews'),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    limit: Number(limit),
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id).populate('reviews.user', 'name avatar');
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true }).populate(
    'reviews.user',
    'name avatar'
  );
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

const createProduct = async (productData, userId) => {
  const product = await Product.create({ ...productData, createdBy: userId });
  return product;
};

const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw new ApiError(404, 'Product not found');
  return { message: 'Product deleted successfully' };
};

const addReview = async (productId, userId, userName, { rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const existingReview = product.reviews.find(
    (r) => r.user.toString() === userId.toString()
  );
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  product.reviews.push({ user: userId, name: userName, rating, comment });
  product.calcAverageRating();
  await product.save();
  return product;
};

const getCategories = async () => {
  const categories = await Product.distinct('category', { isActive: true });
  return categories.sort();
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getCategories,
};
