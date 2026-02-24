const Product = require('../models/Product');
const { PRODUCT_STATUS } = require('../config/constants');

class SearchService {
  async searchProducts({
    query = '',
    category,
    subcategory,
    minPrice,
    maxPrice,
    shop,
    seller,
    rating,
    tags,
    featured,
    inStock = true,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
  }) {
    // Build filter
    const filter = {
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
    };

    if (inStock) {
      filter['inventory.stock'] = { $gt: 0 };
    }

    if (query) {
      filter.$text = { $search: query };
    }

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (shop) {
      filter.shop = shop;
    }

    if (seller) {
      filter.seller = seller;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (rating) {
      filter['ratings.average'] = { $gte: rating };
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { 'ratings.average': -1 };
        break;
      case 'popular':
        sort = { 'sales.count': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'relevance':
      default:
        if (query) {
          sort = { score: { $meta: 'textScore' } };
        } else {
          sort = { featured: -1, 'sales.count': -1 };
        }
    }

    // Execute query
    const skip = (page - 1) * limit;

    const productsQuery = Product.find(filter)
      .populate('category', 'name')
      .populate('shop', 'name slug ratings')
      .populate('seller', 'firstName lastName')
      .select('-isDeleted')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (query && sortBy === 'relevance') {
      productsQuery.select({ score: { $meta: 'textScore' } });
    }

    const [products, total] = await Promise.all([
      productsQuery.exec(),
      Product.countDocuments(filter),
    ]);

    // Get facets for filtering
    const facets = await this.getFacets(filter);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      facets,
    };
  }

  async getFacets(baseFilter) {
    const facetPipeline = [
      { $match: baseFilter },
      {
        $facet: {
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
            { $unwind: '$category' },
            { $project: { _id: 1, name: '$category.name', count: 1 } },
            { $sort: { count: -1 } },
          ],
          priceRanges: [
            {
              $bucket: {
                groupBy: '$price',
                boundaries: [0, 25, 50, 100, 250, 500, 1000, 10000],
                default: '1000+',
                output: { count: { $sum: 1 } },
              },
            },
          ],
          ratings: [
            {
              $bucket: {
                groupBy: '$ratings.average',
                boundaries: [0, 1, 2, 3, 4, 5],
                default: 0,
                output: { count: { $sum: 1 } },
              },
            },
          ],
          shops: [
            { $group: { _id: '$shop', count: { $sum: 1 } } },
            { $lookup: { from: 'shops', localField: '_id', foreignField: '_id', as: 'shop' } },
            { $unwind: '$shop' },
            { $project: { _id: 1, name: '$shop.name', count: 1 } },
            { $sort: { count: -1 } },
            { $limit: 20 },
          ],
          tags: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 30 },
          ],
        },
      },
    ];

    const [facetResults] = await Product.aggregate(facetPipeline);
    return facetResults;
  }

  async getSuggestions(query, limit = 10) {
    const products = await Product.find(
      {
        $text: { $search: query },
        status: PRODUCT_STATUS.ACTIVE,
        isDeleted: false,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('name slug images');

    return products;
  }

  async getRelatedProducts(productId, limit = 8) {
    const product = await Product.findById(productId);
    if (!product) return [];

    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } },
      ],
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
      'inventory.stock': { $gt: 0 },
    })
      .populate('shop', 'name slug ratings')
      .limit(limit)
      .select('-isDeleted');

    return relatedProducts;
  }

  async getTrendingProducts(limit = 12) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get products with most views/sales in last 30 days
    const trending = await Product.find({
      status: PRODUCT_STATUS.ACTIVE,
      isDeleted: false,
      'inventory.stock': { $gt: 0 },
      updatedAt: { $gte: thirtyDaysAgo },
    })
      .sort({ views: -1, 'sales.count': -1 })
      .populate('shop', 'name slug ratings')
      .limit(limit)
      .select('-isDeleted');

    return trending;
  }
}

module.exports = new SearchService();