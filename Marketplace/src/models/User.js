const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { USER_ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.BUYER,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  address: [{
    label: { type: String, default: 'Home' },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: { type: Boolean, default: false },
  }],
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,
  lastLogin: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
// Note: email already has unique: true, so no need to index it again
userSchema.index({ role: 1 });
userSchema.index({ 'shop': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );
};

module.exports = mongoose.model('User', userSchema);
