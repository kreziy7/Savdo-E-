const Wishlist = require('../models/Wishlist.model');
const Product = require('../models/Product.model');
const ApiError = require('../utils/ApiError');

const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    'products',
    'name images finalPrice rating isActive'
  );
  if (!wishlist) return { user: userId, products: [] };
  return wishlist;
};

const toggleWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, products: [] });
  }

  const index = wishlist.products.findIndex(
    (id) => id.toString() === productId.toString()
  );

  let action;
  if (index > -1) {
    wishlist.products.splice(index, 1);
    action = 'removed';
  } else {
    wishlist.products.push(productId);
    action = 'added';
  }

  await wishlist.save();
  return { action, wishlist };
};

const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId.toString()
  );
  await wishlist.save();
  return wishlist;
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
