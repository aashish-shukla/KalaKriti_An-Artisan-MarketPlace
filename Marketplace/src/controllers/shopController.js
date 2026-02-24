const Shop = require('../models/Shop');
const User = require('../models/User');
const Product = require('../models/Product');
const ApiResponse = require('../utils/responses');
const { calculatePagination } = require('../utils/helpers');
const { SHOP_STATUS, USER_ROLES } = require('../config/constants');
const logger = require('../utils/logger');

exports.getShops = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status = SHOP_STATUS.ACTIVE,
      sort = '-createdAt',
    } = req.query;
    
    const query = { status };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const total = await Shop.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);
    
    const shops = await Shop.find(query)
      .populate('owner', 'firstName lastName email')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    ApiResponse.paginated(res, shops, pagination);
  } catch (error) {
    next(error);
  }
};

exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone avatar');
    
    if (!shop) {
      return ApiResponse.error(res, 'Shop not found', 404);
    }
    
    const products = await Product.find({ shop: shop._id, status: 'active' })
      .limit(12)
      .select('name price images ratings');
    
    ApiResponse.success(res, { shop, products });
  } catch (error) {
    next(error);
  }
};

exports.createShop = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (user.role !== USER_ROLES.SELLER) {
      return ApiResponse.error(res, 'Only sellers can create shops', 403);
    }
    
    if (user.shop) {
      return ApiResponse.error(res, 'You already have a shop', 400);
    }
    
    const shop = await Shop.create({
      ...req.body,
      owner: user._id,
    });
    
    user.shop = shop._id;
    await user.save();
    
    logger.info(`Shop created: ${shop.name} by ${user.email}`);
    
    ApiResponse.success(res, { shop }, 'Shop created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateShop = async (req, res, next) => {
  try {
    let shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return ApiResponse.error(res, 'Shop not found', 404);
    }
    
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to update this shop', 403);
    }
    
    shop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    logger.info(`Shop updated: ${shop.name}`);
    
    ApiResponse.success(res, { shop }, 'Shop updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.getShopAnalytics = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return ApiResponse.error(res, 'Shop not found', 404);
    }
    
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized', 403);
    }
    
    const products = await Product.find({ shop: shop._id });
    const totalViews = products.reduce((sum, p) => sum + p.views, 0);
    
    const analytics = {
      stats: shop.stats,
      ratings: shop.ratings,
      totalViews,
      products: {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        outOfStock: products.filter(p => p.status === 'out_of_stock').length,
      },
    };
    
    ApiResponse.success(res, { analytics });
  } catch (error) {
    next(error);
  }
};
