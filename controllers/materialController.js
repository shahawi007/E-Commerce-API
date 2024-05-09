const Material = require("../models/materialModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.createMaterial = catchAsync(async (req, res, next) => {
  const material = await Material.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      material,
    },
  });
});

exports.getAllMaterials = catchAsync(async (req, res, next) => {
  const materials = await Material.find();
  res.status(200).json({
    data: materials,
  });
});

exports.getMaterial = catchAsync(async (req, res, next) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return next(new appError("No material found with that ID", 404));
  }
  res.status(200).json({
    data: {
      material,
    },
  });
});

exports.deleteMaterial = catchAsync(async (req, res, next) => {
  const material = await Material.findByIdAndDelete(req.params.id);
  if (!material) {
    return next(new appError("No material found with that ID", 404));
  }
  res.status(202).json({
    message: "Material deleted successfully",
  });
});
