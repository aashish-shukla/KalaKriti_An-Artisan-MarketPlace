const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    handleValidationErrors,
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  login
);

router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
    handleValidationErrors,
  ],
  updatePassword
);

module.exports = router;
