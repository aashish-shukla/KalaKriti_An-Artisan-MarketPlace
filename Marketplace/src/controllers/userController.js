const User = require('../models/User');
const Product = require('../models/Product');
const ApiResponse = require('../utils/responses');
const { sanitizeUser } = require('../utils/helpers');
const logger = require('../utils/logger');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('shop').populate('wishlist');
    ApiResponse.success(res, { user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'avatar', 'address'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) updates[key] = req.body[key];
    });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    logger.info(`Profile updated: ${user.email}`);
    ApiResponse.success(res, { user: sanitizeUser(user) }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price images inventory status shop',
      populate: { path: 'shop', select: 'name' },
    });
    ApiResponse.success(res, { cart: user.cart });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return ApiResponse.error(res, 'Product not available', 400);
    }
    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    await user.populate('cart.product', 'name price images');
    ApiResponse.success(res, { cart: user.cart }, 'Product added to cart');
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);
    if (!cartItem) {
      return ApiResponse.error(res, 'Product not in cart', 404);
    }
    cartItem.quantity = quantity;
    await user.save();
    ApiResponse.success(res, { cart: user.cart }, 'Cart updated');
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    await user.save();
    ApiResponse.success(res, { cart: user.cart }, 'Product removed from cart');
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    ApiResponse.success(res, null, 'Cart cleared');
  } catch (error) {
    next(error);
  }
};

exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist', 'name price images ratings shop');
    ApiResponse.success(res, { wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(req.params.productId)) {
      return ApiResponse.error(res, 'Product already in wishlist', 400);
    }
    user.wishlist.push(req.params.productId);
    await user.save();
    ApiResponse.success(res, null, 'Product added to wishlist');
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    ApiResponse.success(res, null, 'Product removed from wishlist');
  } catch (error) {
    next(error);
  }
};
