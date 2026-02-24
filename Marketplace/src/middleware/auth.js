const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const ApiResponse = require('../utils/responses');
const logger = require('../utils/logger');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return ApiResponse.error(res, 'Not authorized to access this route', 401);
    }
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return ApiResponse.error(res, 'User not found', 404);
      }
      
      if (!req.user.isActive) {
        return ApiResponse.error(res, 'User account is deactivated', 403);
      }
      
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return ApiResponse.error(res, 'Invalid or expired token', 401);
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return ApiResponse.error(res, 'Authentication error', 500);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }
    next();
  };
};

// Optional auth - adds user to req if token exists
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalid, but we continue without user
        logger.warn('Optional auth - invalid token');
      }
    }
    
    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next();
  }
};
