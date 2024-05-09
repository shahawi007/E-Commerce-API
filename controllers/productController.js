const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const upload = require("../utils/upload");
const cloudinary = require("../utils/cloudinaryConfig");

exports.addProduct = catchAsync(async (req, res, next) => {
  let product = new Product({
    name: req.body.name,
    price_egp: req.body.price_egp,
    evaluation: req.body.evaluation,
  });

  if (!req.files || req.files.length === 0) {
    return next(
      new AppError(
        "Please upload at least one supported photo of your product",
        400
      )
    );
  }

  let cloudinaryUrls = [];
  for (const file of req.files) {
    const result = await cloudinary.uploader.upload(file.path);
    cloudinaryUrls.push(result.secure_url);
  }

  product.photos = cloudinaryUrls;

  await product.save();

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }
  res.status(200).json({
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("No product with that ID", 404));
  }
  res.status(202).json({
    message: "Product deleted successfully",
  });
});
