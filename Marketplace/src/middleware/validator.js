const { validationResult } = require('express-validator');
const ApiResponse = require('./responses');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, 'Validation failed', 400, errors.array());
  }
  next();
};

module.exports = { handleValidationErrors };
