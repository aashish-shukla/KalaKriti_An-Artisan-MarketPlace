const express = require('express');
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateShopStatus,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect, authorize(USER_ROLES.ADMIN)); // All routes require admin

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/shops/:id/status', updateShopStatus);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
