const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("This email is already signed up!", 400));
  }

  const newUser = await User.create({ name, email, password, passwordConfirm });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide your email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  if (!(await user.correctPassword(password))) {
    return next(
      new AppError("Incorrect email or password. Please try again!", 401)
    );
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // console.log("Received token:", token);

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    var userId = decoded.id;
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError("Invalid token. Please log in again.", 401));
  }
});

exports.changeMyPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, passwordConfirm } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(oldPassword))) {
    return next(new AppError("Current password is incorrect", 401));
  }

  if (newPassword !== passwordConfirm) {
    return next(
      new AppError("New password and confirm password do not match", 400)
    );
  }

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});
