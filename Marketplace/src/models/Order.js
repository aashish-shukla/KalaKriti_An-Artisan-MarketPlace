const mongoose = require('mongoose');
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } = require('../config/constants');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
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
    name: String,
    image: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  payment: {
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    transactionId: String,
    paidAt: Date,
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  notes: {
    customer: String,
    seller: String,
    admin: String,
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    shippedAt: Date,
    estimatedDelivery: Date,
    deliveredAt: Date,
  },
  cancelReason: String,
  refund: {
    amount: Number,
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    status: String,
  },
}, {
  timestamps: true,
});

// Indexes
// Note: orderNumber already has unique: true, so no need to index it again
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });
orderSchema.index({ 'items.shop': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });

// Add status to history before updating
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
