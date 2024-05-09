const express = require("express");
const app = express();
const AppError = require("./utils/appError");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoutes");
const materialRouter = require("./routes/materialRoutes");
const productRouter = require("./routes/productRoutes");
const errorHandler = require("./controllers/errorController");
const dotenv = require("dotenv");
const User = require("./models/userModel");
const materialController = require("./controllers/materialController");
dotenv.config();
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_SECRET_KEY);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/materials", materialRouter);
app.use("/api/v1/products", productRouter);
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_SECRET_KEY);
app.use(errorHandler);
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // // useCreateIndex: true,
    // // useFindAndModify: false,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully!"))
  .catch((err) => console.error("Error connecting to DB:", err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
