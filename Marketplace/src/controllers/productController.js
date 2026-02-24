const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ApiResponse = require('../utils/responses');
const { calculatePagination } = require('../utils/helpers');
const logger = require('../utils/logger');
const { PRODUCT_STATUS } = require('../config/constants');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      shop,
      seller,
      search,
      sort = '-createdAt',
      featured,
      status = PRODUCT_STATUS.ACTIVE,
    } = req.query;
    
    const query = { isDeleted: false, status };
    
    if (category) query.category = category;
    if (shop) query.shop = shop;
    if (seller) query.seller = seller;
    if (featured) query.featured = featured === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    const total = await Product.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);
    
    const products = await Product.find(query)
      .populate('shop', 'name slug logo')
      .populate('seller', 'firstName lastName')
      .populate('category', 'name slug')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    ApiResponse.paginated(res, products, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shop', 'name slug logo description ratings')
      .populate('seller', 'firstName lastName avatar')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'firstName lastName avatar' },
        options: { sort: '-createdAt', limit: 10 },
      });
    
    if (!product || product.isDeleted) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    
    // Increment views
    product.views += 1;
    await product.save();
    
    ApiResponse.success(res, { product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private (Seller)
const createProduct = async (req, res, next) => {
  try {
    const seller = req.user;
    
    if (!seller.shop) {
      return ApiResponse.error(res, 'You must have a shop to create products', 400);
    }
    
    const shop = await Shop.findById(seller.shop);
    if (!shop || shop.status !== 'active') {
      return ApiResponse.error(res, 'Shop is not active', 400);
    }
    
    const productData = {
      ...req.body,
      seller: seller._id,
      shop: seller.shop,
    };
    
    const product = await Product.create(productData);
    
    // Update shop stats
    shop.stats.totalProducts += 1;
    await shop.save();
    
    logger.info(`Product created: ${product.name} by ${seller.email}`);
    
    ApiResponse.success(res, { product }, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Seller)
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product || product.isDeleted) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    
    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to update this product', 403);
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    logger.info(`Product updated: ${product.name}`);
    
    ApiResponse.success(res, { product }, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Seller)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || product.isDeleted) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    
    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to delete this product', 403);
    }
    
    product.isDeleted = true;
    await product.save();
    
    // Update shop stats
    const shop = await Shop.findById(product.shop);
    if (shop) {
      shop.stats.totalProducts -= 1;
      await shop.save();
    }
    
    logger.info(`Product deleted: ${product.name}`);
    
    ApiResponse.success(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
