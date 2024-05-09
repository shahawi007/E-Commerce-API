const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please write your name"],
  },
  email: {
    type: String,
    required: [true, "Please write your email"],
    lowercase: true,
    unique: [true, "This email already signed up!"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,

    required: function () {
      return this.isNew;
    },

    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordconfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log("Password Comparison Result:", result);
  return result;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
