const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../utils/upload");
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

router.use(authController.protect);
router
  .route("/")
  .post(upload.array("photos", 4), productController.addProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .delete(productController.deleteProduct);

router.route("/:productId/addtocart").post(cartController.addtocart);
module.exports = router;
