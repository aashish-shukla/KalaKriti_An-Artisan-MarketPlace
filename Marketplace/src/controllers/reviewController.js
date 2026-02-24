const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiResponse = require('../utils/responses');
const { calculatePagination } = require('../utils/helpers');
const logger = require('../utils/logger');

exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, rating, sort = '-createdAt' } = req.query;
    
    const query = { product: req.params.productId, isApproved: true };
    if (rating) query.rating = parseInt(rating);
    
    const total = await Review.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);
    
    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName avatar')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    ApiResponse.paginated(res, reviews, pagination);
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    
    const existingReview = await Review.findOne({
      product: req.params.productId,
      user: req.user.id,
    });
    
    if (existingReview) {
      return ApiResponse.error(res, 'You have already reviewed this product', 400);
    }
    
    const order = await Order.findOne({
      buyer: req.user.id,
      'items.product': req.params.productId,
      status: 'delivered',
    });
    
    const review = await Review.create({
      product: req.params.productId,
      user: req.user.id,
      rating,
      title,
      comment,
      verified: !!order,
      order: order?._id,
    });
    
    logger.info(`Review created for product ${product.name} by ${req.user.email}`);
    
    ApiResponse.success(res, { review }, 'Review created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return ApiResponse.error(res, 'Review not found', 404);
    }
    
    if (review.user.toString() !== req.user.id) {
      return ApiResponse.error(res, 'Not authorized to update this review', 403);
    }
    
    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    ApiResponse.success(res, { review }, 'Review updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return ApiResponse.error(res, 'Review not found', 404);
    }
    
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to delete this review', 403);
    }
    
    await review.deleteOne();
    
    ApiResponse.success(res, null, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return ApiResponse.error(res, 'Review not found', 404);
    }
    
    const index = review.helpful.indexOf(req.user.id);
    if (index > -1) {
      review.helpful.splice(index, 1);
    } else {
      review.helpful.push(req.user.id);
    }
    
    await review.save();
    
    ApiResponse.success(res, { helpful: review.helpful.length });
  } catch (error) {
    next(error);
  }
};
