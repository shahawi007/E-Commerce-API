const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.addtocart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("No user product found", 404));
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    cart.products.push(productId);
    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Product added to cart successfully",
    });
  } catch (err) {
    return next(err);
  }
});

exports.showcart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No products added to cart",
        data: {
          products: [],
          totalPrice: 0,
        },
      });
    }

    const productIds = cart.products;

    const products = await Product.find({ _id: { $in: productIds } });

    const totalPrice = products.reduce(
      (total, product) => total + product.price_egp,
      0
    );

    res.status(200).json({
      status: "success",
      data: {
        products,
        totalprice: totalPrice,
      },
    });
  } catch (err) {
    return next(err);
  }
});

exports.deleteFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return next(new appError("No product found found with this Id"));
    }
    await Cart.updateOne({ user: userId }, { $pull: { products: productId } });
    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Product removed from cart successfully",
    });
  } catch (err) {
    return next(err);
  }
});
