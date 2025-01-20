const AppError = require("../utils/appError");

module.exports = (err, req, res, next) => {
  // Log error stack for debugging (optional)
  // console.log(err.stack);

  // Set default statusCode and status if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send the error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
