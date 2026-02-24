const express = require('express');
const {
  getProfile,
  updateProfile,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/profile').get(getProfile).put(updateProfile);

router.route('/cart')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router
  .route('/cart/:productId')
  .put(updateCartItem)
  .delete(removeFromCart);

router.route('/wishlist').get(getWishlist);

router
  .route('/wishlist/:productId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

module.exports = router;
