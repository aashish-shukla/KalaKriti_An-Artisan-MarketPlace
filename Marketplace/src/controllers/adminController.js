const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const ApiResponse = require('../utils/responses');
const { calculatePagination } = require('../utils/helpers');
const logger = require('../utils/logger');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalSellers,
      totalShops,
      totalProducts,
      totalOrders,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'seller' }),
      Shop.countDocuments(),
      Product.countDocuments({ isDeleted: false }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
    ]);
    
    const revenueStats = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
      }},
    ]);
    
    const stats = {
      users: {
        total: totalUsers,
        sellers: totalSellers,
        buyers: totalUsers - totalSellers,
      },
      shops: totalShops,
      products: totalProducts,
      orders: {
        total: totalOrders,
        pending: pendingOrders,
      },
      revenue: revenueStats[0]?.totalRevenue || 0,
    };
    
    ApiResponse.success(res, { stats });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    const total = await User.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);
    
    const users = await User.find(query)
      .select('-password -refreshToken')
      .populate('shop', 'name status')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    ApiResponse.paginated(res, users, pagination);
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }
    
    logger.info(`User ${user.email} ${isActive ? 'activated' : 'deactivated'} by admin`);
    
    ApiResponse.success(res, { user }, 'User status updated');
  } catch (error) {
    next(error);
  }
};

exports.updateShopStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!shop) {
      return ApiResponse.error(res, 'Shop not found', 404);
    }
    
    logger.info(`Shop ${shop.name} status changed to ${status} by admin`);
    
    ApiResponse.success(res, { shop }, 'Shop status updated');
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    
    logger.info(`Category created: ${category.name}`);
    
    ApiResponse.success(res, { category }, 'Category created', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }
    
    ApiResponse.success(res, { category }, 'Category updated');
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }
    
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return ApiResponse.error(res, 'Cannot delete category with products', 400);
    }
    
    await category.deleteOne();
    
    ApiResponse.success(res, null, 'Category deleted');
  } catch (error) {
    next(error);
  }
};
