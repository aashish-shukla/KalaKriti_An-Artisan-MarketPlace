const mongoose = require('mongoose');
const { generateSlug } = require('../utils/helpers');
const { SHOP_STATUS } = require('../config/constants');

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    maxlength: [100, 'Shop name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Shop description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  logo: {
    type: String,
  },
  banner: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(SHOP_STATUS),
    default: SHOP_STATUS.PENDING_APPROVAL,
  },
  businessDetails: {
    businessName: String,
    taxId: String,
    businessType: String,
    registrationNumber: String,
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number], // [longitude, latitude]
    },
  },
  categories: [{
    type: String,
  }],
  policies: {
    returnPolicy: String,
    shippingPolicy: String,
    refundPolicy: String,
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  stats: {
    totalProducts: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationDocuments: [{
    type: String,
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
// Note: slug and owner already have unique: true, so no need to index them again
shopSchema.index({ status: 1 });
shopSchema.index({ 'address.coordinates': '2dsphere' });

// Generate slug before saving
shopSchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = generateSlug(this.name);
  
  // Ensure unique slug
  const slugRegEx = new RegExp(`^${this.slug}(-[0-9]+)?$`, 'i');
  const shopsWithSlug = await this.constructor.find({ slug: slugRegEx });
  
  if (shopsWithSlug.length > 0 && !shopsWithSlug.some(shop => shop._id.equals(this._id))) {
    this.slug = `${this.slug}-${shopsWithSlug.length}`;
  }
  
  next();
});

// Virtual populate for products
shopSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'shop',
});

module.exports = mongoose.model('Shop', shopSchema);
