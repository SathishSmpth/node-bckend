const AppError = require("../utils/appError");

const handleCastError = (error) => {
  const message = `Invalid ${error.path}:${error.value}`;
  return new AppError(message, 400);
};

const handleValidationError = (error) => {
  const message = Object.values(error.errors).map((el) => el.message);
  return new AppError(message, 400);
};

const handleDulpicateFieldError = (error) => {
  const field = Object.keys(error.keyPattern)[0];
  const message = `${field} is already exists!`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = (error) => {
  const message = `Invalid token.Please login again!`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = (error) => {
  const message = `Your token is expired.Please login again!`;
  return new AppError(message, 400);
};

const sendErrorResponse = (error, res) => {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    error: error,
  });
};

module.exports = (error, req, res, next) => {
  if (error.name === "CastError") {
    error = handleCastError(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidationError(error);
  }
  if (error.code === 11000) {
    error = handleDulpicateFieldError(error);
  }
  if(error.name === "JsonWebTokenError"){
    error = handleJsonWebTokenError(error);
  }
  if(error.name === "TokenExpiredError"){
    error = handleTokenExpiredError(error);
  }
  sendErrorResponse(error, res);
};
