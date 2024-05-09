const mongoose = require("mongoose");
const validator = require("validator");

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please write your material name"],
  },
  price_egp: {
    type: Number,
    validate: {
      validator: function (value) {
        // Custom validation to check if the value is a valid decimal
        return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0; // Check if the value is a valid number and non-negative
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
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
