const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getOrders);

router.route('/:id').get(protect, getOrder);

router
  .route('/:id/status')
  .put(protect, authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN), updateOrderStatus);

router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;
