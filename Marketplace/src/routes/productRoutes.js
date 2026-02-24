const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN), updateProduct)
  .delete(protect, authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN), deleteProduct);

module.exports = router;
