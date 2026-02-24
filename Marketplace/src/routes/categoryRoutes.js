// Marketplace/src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const ApiResponse = require('../utils/responses');

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    ApiResponse.success(res, { categories });
  } catch (error) {
    next(error);
  }
});

// Get category by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }
    ApiResponse.success(res, { category });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
