const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email!"],
  },
  username: {
    type: String,
    required: [true, "Username is required!"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Phone is required!"],
    unique: true,
    minlength: 10,
    maxlength: 10,
    validate: {
      validator: function (phone) {
        const regex = /^[0-9]*$/;
        return regex.test(phone);
      },
      message: "Please enter valid phone number!",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    validate: {
      validator: function (password) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        return regex.test(password);
      },
      message:
        "Password must be 6-20 characters long, contain letters, special characters and numbers, and must not contain spaces, or emoji.",
    },
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm Password is required!"],
    validate: {
      validator: function (confirmPassword) {
        return this.password === confirmPassword;
      },
      message: "Confirm password doesn't match with password!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.set("timestamps", true);

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.passwordChanged = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 10000,
      10
    );

    return JWTTimeStamp < changeTimeStamp;
  }
  return false;
};
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
