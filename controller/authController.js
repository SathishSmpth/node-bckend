const AppError = require("../utils/appError");
const User = require("../models/userModel");
const signJwtToken = require("../utils/signJwtToken");
const crypto = require("crypto");

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = signJwtToken(newUser._id);
    res.status(201).json({
      success: true,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check email and password exist from the request
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    // check user is exist on given email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Email is incorrect!", 401));
    }

    if (!(await user.comparePassword(user.password,password))) {
      return next(new AppError("Password is incorrect!", 401));
    }

    const token = signJwtToken(user._id);

    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      next(new AppError("Email is Incorrect!", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      passwordResetToken: resetToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      next(new AppError("Email is Incorrect!", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      passwordResetToken: resetToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      next(new AppError("Token is invalid or has expired!", 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();
    const token = signJwtToken(user._id);

    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
