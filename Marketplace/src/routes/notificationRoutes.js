// Marketplace/src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/responses');

// Get user notifications
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ user: req.user._id });
    const unreadCount = await Notification.countDocuments({ 
      user: req.user._id, 
      isRead: false 
    });

    ApiResponse.success(res, {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.patch('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return ApiResponse.error(res, 'Notification not found', 404);
    }

    ApiResponse.success(res, { notification });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.post('/read-all', protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    ApiResponse.success(res, { message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return ApiResponse.error(res, 'Notification not found', 404);
    }

    ApiResponse.success(res, { message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
