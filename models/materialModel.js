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
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
