const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { PRODUCT_STATUS } = require('../config/constants');

class RecommendationService {
  async getPersonalizedRecommendations(userId, limit = 12) {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) return [];

    // Get user's order history
    const userOrders = await Order.find({ buyer: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(20);

    // Extract categories and tags from user's purchase history
    const purchasedCategories = new Set();
    const purchasedTags = new Set();
    const purchasedProducts = new Set();

    userOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          purchasedProducts.add(item.product._id.toString());
          if (item.product.category) {
            purchasedCategories.add(item.product.category.toString());
          }
          if (item.product.tags) {
            item.product.tags.forEach(tag => purchasedTags.add(tag));
          }
        }
      });
    });

    // Include wishlist preferences
    user.wishlist.forEach(product => {
      if (product.category) {
        purchasedCategories.add(product.category.toString());
      }
      if (product.tags) {
        product.tags.forEach(tag => purchasedTags.add(tag));
      }
    });

    // Build recommendation query
    const query = {
      _id: { $nin: Array.from(purchasedProducts) },
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
      'inventory.stock': { $gt: 0 },
    };

    // Add scoring based on user preferences
    if (purchasedCategories.size > 0 || purchasedTags.size > 0) {
      query.$or = [];
      if (purchasedCategories.size > 0) {
        query.$or.push({ category: { $in: Array.from(purchasedCategories) } });
      }
      if (purchasedTags.size > 0) {
        query.$or.push({ tags: { $in: Array.from(purchasedTags) } });
      }
    }

    const recommendations = await Product.find(query)
      .populate('shop', 'name slug ratings')
      .populate('category', 'name')
      .sort({ 'ratings.average': -1, 'sales.count': -1 })
      .limit(limit)
      .select('-isDeleted');

    // If not enough recommendations, add popular products
    if (recommendations.length < limit) {
      const additionalProducts = await this.getPopularProducts(
        limit - recommendations.length,
        Array.from(purchasedProducts)
      );
      recommendations.push(...additionalProducts);
    }

    return recommendations;
  }

  async getPopularProducts(limit = 12, excludeIds = []) {
    return Product.find({
      _id: { $nin: excludeIds },
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
      'inventory.stock': { $gt: 0 },
    })
      .sort({ 'sales.count': -1, 'ratings.average': -1 })
      .populate('shop', 'name slug ratings')
      .populate('category', 'name')
      .limit(limit)
      .select('-isDeleted');
  }

  async getCollaborativeRecommendations(userId, limit = 12) {
    // Find users with similar purchase patterns
    const userOrders = await Order.find({ buyer: userId })
      .select('items.product')
      .lean();

    const userProductIds = userOrders
      .flatMap(order => order.items.map(item => item.product.toString()));

    if (userProductIds.length === 0) {
      return this.getPopularProducts(limit);
    }

    // Find other users who bought similar products
    const similarUsers = await Order.aggregate([
      {
        $match: {
          buyer: { $ne: userId },
          'items.product': { $in: userProductIds },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$buyer',
          commonProducts: { $addToSet: '$items.product' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get products bought by similar users
    const similarUserIds = similarUsers.map(u => u._id);
    const recommendedProducts = await Order.aggregate([
      {
        $match: {
          buyer: { $in: similarUserIds },
          'items.product': { $nin: userProductIds },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const productIds = recommendedProducts.map(p => p._id);

    const products = await Product.find({
      _id: { $in: productIds },
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
      'inventory.stock': { $gt: 0 },
    })
      .populate('shop', 'name slug ratings')
      .populate('category', 'name')
      .select('-isDeleted');

    return products;
  }

  async getNewArrivals(limit = 12) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return Product.find({
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
      'inventory.stock': { $gt: 0 },
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ createdAt: -1 })
      .populate('shop', 'name slug ratings')
      .populate('category', 'name')
      .limit(limit)
      .select('-isDeleted');
  }

  async getFeaturedProducts(limit = 8) {
    return Product.find({
      featured: true,
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
      'inventory.stock': { $gt: 0 },
    })
      .sort({ 'ratings.average': -1 })
      .populate('shop', 'name slug ratings')
      .populate('category', 'name')
      .limit(limit)
      .select('-isDeleted');
  }
}

module.exports = new RecommendationService();