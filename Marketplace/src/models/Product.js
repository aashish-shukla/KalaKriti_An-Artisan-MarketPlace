const mongoose = require('mongoose');
const { generateSlug } = require('../utils/helpers');
const { PRODUCT_STATUS } = require('../config/constants');

const productSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false },
  }],
  inventory: {
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
  },
  variants: [{
    name: String,
    options: [String],
  }],
  specifications: [{
    key: String,
    value: String,
  }],
  tags: [String],
  status: {
    type: String,
    enum: Object.values(PRODUCT_STATUS),
    default: PRODUCT_STATUS.ACTIVE,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  sales: {
    count: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  views: {
    type: Number,
    default: 0,
  },
  weight: {
    value: Number,
    unit: { type: String, default: 'kg' },
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' },
  },
  shipping: {
    isFreeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
    processingTime: { type: String },
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
// Note: slug and inventory.sku already have unique: true, so no need to index them again
productSchema.index({ shop: 1, status: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Generate slug
productSchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = generateSlug(this.name);
  
  // Ensure unique slug
  const slugRegEx = new RegExp(`^${this.slug}(-[0-9]+)?$`, 'i');
  const productsWithSlug = await this.constructor.find({ slug: slugRegEx });
  
  if (productsWithSlug.length > 0 && !productsWithSlug.some(p => p._id.equals(this._id))) {
    this.slug = `${this.slug}-${productsWithSlug.length}`;
  }
  
  next();
});

// Update status based on stock
productSchema.pre('save', function(next) {
  if (this.inventory.trackInventory && this.inventory.stock === 0) {
    this.status = PRODUCT_STATUS.OUT_OF_STOCK;
  }
  next();
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Calculate discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

module.exports = mongoose.model('Product', productSchema);
