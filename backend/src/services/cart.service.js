const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const ApiError = require('../utils/ApiError');

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name images finalPrice stock isActive'
  );
  if (!cart) {
    return { user: userId, items: [], totalItems: 0, totalPrice: 0 };
  }
  return cart;
};

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }
  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} items in stock`);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (newQty > product.stock) {
      throw new ApiError(400, `Only ${product.stock} items available`);
    }
    existingItem.quantity = newQty;
    existingItem.price = product.finalPrice;
  } else {
    cart.items.push({ product: productId, quantity, price: product.finalPrice });
  }

  await cart.save();
  return cart.populate('items.product', 'name images finalPrice stock');
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();
  return cart;
};

const updateCartItem = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} items in stock`);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((i) => i.product.toString() === productId.toString());
  if (!item) throw new ApiError(404, 'Item not in cart');

  item.quantity = quantity;
  item.price = product.finalPrice;
  await cart.save();
  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, clearCart };
