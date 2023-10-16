const AppError = require("../utils/appError");
const Products = require("../models/productModel");

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Products.create({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.imageUrl,
      createdBy: req.user,
    });
    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAProduct = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      next(new AppError("Product is not found!", 404));
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (product) {
      next(new AppError("Product is not found!", 404));
    }
    res.status(204).json({
      success: true,
      message: "product deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
