const Order = require('../models/Order');
const Product = require('../models/Product');
const ApiResponse = require('../utils/responses');
const { generateOrderNumber, calculatePagination } = require('../utils/helpers');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, payment } = req.body;
    
    if (!items || items.length === 0) {
      return ApiResponse.error(res, 'No order items provided', 400);
    }
    
    let subtotal = 0;
    const processedItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product)
        .populate('shop')
        .populate('seller');
      
      if (!product || product.status !== 'active') {
        return ApiResponse.error(res, `Product ${item.product} is not available`, 400);
      }
      
      if (product.inventory.trackInventory && product.inventory.stock < item.quantity) {
        return ApiResponse.error(res, `Insufficient stock for ${product.name}`, 400);
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      processedItems.push({
        product: product._id,
        shop: product.shop._id,
        seller: product.seller._id,
        name: product.name,
        image: product.images[0]?.url,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
      
      if (product.inventory.trackInventory) {
        product.inventory.stock -= item.quantity;
      }
      product.sales.count += item.quantity;
      product.sales.revenue += itemTotal;
      await product.save();
    }
    
    const shipping = req.body.pricing?.shipping || 0;
    const tax = req.body.pricing?.tax || 0;
    const discount = req.body.pricing?.discount || 0;
    const total = subtotal + shipping + tax - discount;
    
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      buyer: req.user.id,
      items: processedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      pricing: {
        subtotal,
        shipping,
        tax,
        discount,
        total,
      },
      payment: {
        method: payment.method,
        status: PAYMENT_STATUS.PENDING,
      },
    });
    
    req.user.cart = [];
    await req.user.save();
    
    logger.info(`Order created: ${order.orderNumber} by ${req.user.email}`);
    
    ApiResponse.success(res, { order }, 'Order created successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    
    let query = {};
    
    if (req.user.role === 'buyer') {
      query.buyer = req.user.id;
    } else if (req.user.role === 'seller') {
      query['items.seller'] = req.user.id;
    }
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const total = await Order.countDocuments(query);
    const pagination = calculatePagination(page, limit, total);
    
    const orders = await Order.find(query)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .populate('items.shop', 'name')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    ApiResponse.paginated(res, orders, pagination);
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'firstName lastName email phone')
      .populate('items.product', 'name images slug')
      .populate('items.shop', 'name slug')
      .populate('items.seller', 'firstName lastName email');
    
    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }
    
    const isBuyer = order.buyer._id.toString() === req.user.id;
    const isSeller = order.items.some(item => item.seller._id.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isBuyer && !isSeller && !isAdmin) {
      return ApiResponse.error(res, 'Not authorized to view this order', 403);
    }
    
    ApiResponse.success(res, { order });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }
    
    const isSeller = order.items.some(item => item.seller.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isSeller && !isAdmin) {
      return ApiResponse.error(res, 'Not authorized to update this order', 403);
    }
    
    order.status = status;
    order.statusHistory.push({
      status,
      note,
      updatedBy: req.user.id,
    });
    
    if (status === ORDER_STATUS.DELIVERED) {
      order.tracking.deliveredAt = new Date();
    }
    
    await order.save();
    
    logger.info(`Order ${order.orderNumber} status updated to ${status}`);
    
    ApiResponse.success(res, { order }, 'Order status updated');
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }
    
    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to cancel this order', 403);
    }
    
    if (![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status)) {
      return ApiResponse.error(res, 'Cannot cancel order in current status', 400);
    }
    
    order.status = ORDER_STATUS.CANCELLED;
    order.cancelReason = reason;
    
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && product.inventory.trackInventory) {
        product.inventory.stock += item.quantity;
        product.sales.count -= item.quantity;
        product.sales.revenue -= item.total;
        await product.save();
      }
    }
    
    await order.save();
    
    logger.info(`Order ${order.orderNumber} cancelled by ${req.user.email}`);
    
    ApiResponse.success(res, { order }, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};
