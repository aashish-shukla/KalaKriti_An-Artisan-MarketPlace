const express = require('express');
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  getShopAnalytics,
} = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router
  .route('/')
  .get(getShops)
  .post(protect, authorize(USER_ROLES.SELLER), createShop);

router
  .route('/:id')
  .get(getShop)
  .put(protect, updateShop);

router.route('/:id/analytics').get(protect, getShopAnalytics);

module.exports = router;
