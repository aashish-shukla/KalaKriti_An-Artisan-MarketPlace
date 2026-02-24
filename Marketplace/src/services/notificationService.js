const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class NotificationService {
  async createNotification({ user, type, title, message, link, data }) {
    try {
      const notification = await Notification.create({
        user,
        type,
        title,
        message,
        link,
        data,
      });

      // Emit real-time notification via Socket.io
      if (global.io) {
        global.io.to(`user:${user.toString()}`).emit('notification', notification);
      }

      return notification;
    } catch (error) {
      logger.error(`Failed to create notification: ${error.message}`);
      throw error;
    }
  }

  async notifyNewOrder(seller, order) {
    return this.createNotification({
      user: seller,
      type: 'order',
      title: 'New Order Received',
      message: `You have a new order #${order.orderNumber}`,
      link: `/seller/orders/${order._id}`,
      data: { orderId: order._id },
    });
  }

  async notifyOrderStatusChange(buyer, order, newStatus) {
    const messages = {
      confirmed: 'Your order has been confirmed',
      processing: 'Your order is being prepared',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
    };

    return this.createNotification({
      user: buyer,
      type: 'order_status',
      title: 'Order Update',
      message: messages[newStatus] || 'Your order status has been updated',
      link: `/orders/${order._id}`,
      data: { orderId: order._id, status: newStatus },
    });
  }

  async notifyLowStock(seller, product) {
    return this.createNotification({
      user: seller,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: `${product.name} is running low on stock (${product.inventory.stock} remaining)`,
      link: `/seller/products/${product._id}`,
      data: { productId: product._id },
    });
  }

  async notifyNewReview(seller, review, product) {
    return this.createNotification({
      user: seller,
      type: 'review',
      title: 'New Review',
      message: `${product.name} received a new ${review.rating}-star review`,
      link: `/seller/reviews`,
      data: { reviewId: review._id, productId: product._id },
    });
  }

  async notifyShopApproval(seller, shop) {
    return this.createNotification({
      user: seller,
      type: 'shop',
      title: 'Shop Approved',
      message: `Congratulations! Your shop "${shop.name}" has been approved`,
      link: '/seller/dashboard',
      data: { shopId: shop._id },
    });
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const query = { user: userId };
    if (unreadOnly) query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  async deleteNotification(notificationId, userId) {
    await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  }
}

module.exports = new NotificationService();