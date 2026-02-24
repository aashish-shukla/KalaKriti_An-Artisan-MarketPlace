const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { ORDER_STATUS } = require('../config/constants');

class AnalyticsService {
  async getSellerDashboard(sellerId, { startDate, endDate } = {}) {
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = { seller: sellerId };
    if (Object.keys(dateFilter).length) {
      matchStage.createdAt = dateFilter;
    }

    // Sales overview
    const salesData = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$items.total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$items.total' },
        },
      },
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // Revenue trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueTrend = await Order.aggregate([
      {
        $match: {
          seller: sellerId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$items.total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Product performance
    const productStats = await Product.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$inventory.stock', 0] }, 1, 0] },
          },
          averageRating: { $avg: '$ratings.average' },
          totalViews: { $sum: '$views' },
        },
      },
    ]);

    return {
      sales: salesData[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
      },
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topProducts,
      revenueTrend,
      products: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        outOfStock: 0,
        averageRating: 0,
        totalViews: 0,
      },
    };
  }

  async getAdminDashboard() {
    // Platform overview
    const [users, shops, products, orders] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    // Revenue overview
    const revenueData = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          averageOrderValue: { $avg: '$pricing.total' },
        },
      },
    ]);

    // Recent activity
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer', 'firstName lastName email')
      .select('orderNumber pricing.total status createdAt');

    const recentShops = await Shop.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'firstName lastName email')
      .select('name status createdAt');

    // Top sellers
    const topSellers = await Shop.find({ status: 'active' })
      .sort({ 'stats.totalRevenue': -1 })
      .limit(10)
      .select('name stats.totalRevenue stats.totalOrders ratings.average');

    // Growth metrics (last 30 days vs previous 30)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [currentPeriod, previousPeriod] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Order.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
    ]);

    const growth = previousPeriod > 0
      ? ((currentPeriod - previousPeriod) / previousPeriod) * 100
      : 0;

    return {
      overview: {
        totalUsers: users,
        totalShops: shops,
        totalProducts: products,
        totalOrders: orders,
      },
      revenue: revenueData[0] || {
        totalRevenue: 0,
        averageOrderValue: 0,
      },
      growth: {
        ordersGrowth: growth.toFixed(2),
      },
      recentOrders,
      recentShops,
      topSellers,
    };
  }

  async getProductInsights(productId) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    // Sales trend
    const salesTrend = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.product': productId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 90 },
    ]);

    // Customer demographics (simplified)
    const buyerLocations = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.product': productId } },
      {
        $group: {
          _id: '$shippingAddress.city',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return {
      product: {
        name: product.name,
        totalSales: product.sales.count,
        totalRevenue: product.sales.revenue,
        averageRating: product.ratings.average,
        views: product.views,
        conversionRate: product.views > 0
          ? ((product.sales.count / product.views) * 100).toFixed(2)
          : 0,
      },
      salesTrend,
      buyerLocations,
    };
  }
}

module.exports = new AnalyticsService();