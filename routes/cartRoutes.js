const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.route("/").get(cartController.showcart);
router.route("/:productId").delete(cartController.deleteFromCart);

module.exports = router;
