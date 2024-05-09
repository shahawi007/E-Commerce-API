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
    enum: ["user", "admin"], //specify types
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, // not to show up in any output
  },
  passwordConfirm: {
    type: String,
    // Conditionally apply validation based on isNew
    required: function () {
      return this.isNew;
    },
    // this works only on create and  save
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
  // only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordconfirm field
  this.passwordConfirm = undefined;
  next();
});

// instance method is a method is gonna be avaliable in all documents
// candidatepassword is password recieved from the body
// Update the correctPassword method in your user model
userSchema.methods.correctPassword = async function (candidatePassword) {
  // Compare the candidate password with the stored hash
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log("Password Comparison Result:", result);
  return result;
};

// userSchema.methods.correctPassword = async function (candidatePassword) {
//   console.log(this.password);
//   console.log(candidatePassword);
//   return await bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
