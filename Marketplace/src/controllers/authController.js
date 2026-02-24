const crypto = require('crypto');
const User = require('../models/User');
const Shop = require('../models/Shop');
const ApiResponse = require('../utils/responses');
const { sanitizeUser } = require('../utils/helpers');
const logger = require('../utils/logger');
const { USER_ROLES, SHOP_STATUS } = require('../config/constants');
const config = require('../config/env');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(res, 'Email already registered', 400);
    }
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || USER_ROLES.BUYER,
      phone,
    });
    
    // If seller, create shop
    if (user.role === USER_ROLES.SELLER && req.body.shopDetails) {
      const shop = await Shop.create({
        owner: user._id,
        name: req.body.shopDetails.name,
        description: req.body.shopDetails.description,
        status: SHOP_STATUS.PENDING_APPROVAL,
      });
      user.shop = shop._id;
      await user.save();
    }
    
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    logger.info(`New user registered: ${user.email}`);
    
    ApiResponse.success(res, {
      user: sanitizeUser(user),
      token,
      refreshToken,
    }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide email and password', 400);
    }
    
    // Check user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }
    
    // Check if active
    if (!user.isActive) {
      return ApiResponse.error(res, 'Account is deactivated', 403);
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }
    
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    logger.info(`User logged in: ${user.email}`);
    
    ApiResponse.success(res, {
      user: sanitizeUser(user),
      token,
      refreshToken,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('shop')
      .populate('wishlist', 'name price images');
    
    ApiResponse.success(res, { user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();
    
    ApiResponse.success(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token required', 400);
    }
    
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return ApiResponse.error(res, 'Invalid refresh token', 401);
    }
    
    const newToken = user.generateAuthToken();
    
    ApiResponse.success(res, { token: newToken }, 'Token refreshed');
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/v1/auth/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.error(res, 'Current password is incorrect', 400);
    }
    
    user.password = newPassword;
    await user.save();
    
    const token = user.generateAuthToken();
    
    ApiResponse.success(res, { token }, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};
