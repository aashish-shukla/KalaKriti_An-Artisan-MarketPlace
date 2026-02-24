const slugify = require('slugify');

const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

const calculatePagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 20;
  const skip = (currentPage - 1) * pageSize;
  
  return {
    page: currentPage,
    limit: pageSize,
    skip,
    total,
    pages: Math.ceil(total / pageSize),
  };
};

const sanitizeUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
};

module.exports = {
  generateSlug,
  calculatePagination,
  sanitizeUser,
  calculateAverageRating,
  generateOrderNumber,
};
