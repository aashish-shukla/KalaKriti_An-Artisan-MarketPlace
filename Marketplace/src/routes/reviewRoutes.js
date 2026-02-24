const express = require('express');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(getProductReviews).post(protect, createReview);

router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:id/helpful').post(protect, markHelpful);

module.exports = router;
