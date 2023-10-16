const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.isAuth = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      const user = await User.findById(decoded.id);

      if (!user) {
        next(
          new AppError("User belonging to this token is does not exists!", 401)
        );
      }
      if (user.passwordChanged(decoded.iat)) {
        return next(
          new AppError(
            "You are changed your password recently logtin again!",
            401
          )
        );
      }
      req.user = user._id;
      next();
    } else {
      return next(new AppError("Please login or signup!", 401));
    }
  } catch (error) {
    next(error);
  }
};
