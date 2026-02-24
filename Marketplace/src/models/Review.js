const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
  },
  images: [{
    type: String,
  }],
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  verified: {
    type: Boolean,
    default: false,
  },
  response: {
    comment: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: Date,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: 1 });
reviewSchema.index({ user: 1 });

// Update product rating after save
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product) {
    const Review = mongoose.model('Review');
    const stats = await Review.aggregate([
      { $match: { product: this.product, isApproved: true } },
      { $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      }},
    ]);
    
    if (stats.length > 0) {
      product.ratings.average = Math.round(stats[0].avgRating * 10) / 10;
      product.ratings.count = stats[0].count;
      await product.save();
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
