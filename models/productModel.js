const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please write your product name"],
  },
  price_egp: {
    type: Number,
    validate: {
      validator: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0;
      },
      message: "Price must be a valid price",
    },
    required: [true, "Please provide the price in Egyptian pounds"],
  },
  evaluation: {
    type: Number,
    min: 1,
    max: 5,
  },
  photos: {
    type: [String],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
