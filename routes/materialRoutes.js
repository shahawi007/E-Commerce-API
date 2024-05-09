const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router
  .route("/")
  .get(materialController.getAllMaterials)
  .post(materialController.createMaterial);

router
  .route("/:id")
  .get(materialController.getMaterial)
  .delete(materialController.deleteMaterial);

module.exports = router;
