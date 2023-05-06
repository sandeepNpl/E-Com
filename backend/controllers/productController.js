const Product = require("../models/productModel");
const tryCatchError = require("../middleware/tryCatchError");
const ApiFeature = require("../utils/apiFeatures");

// Create Product -- Admin
const createProduct = tryCatchError(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});


// Get all product
const getAllProducts = tryCatchError(async (req, res) => {
    console.log(req.query)
   new ApiFeature(Product.find(),req.query.keyword)
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// Get product details
const getProductDetails = tryCatchError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Error("Product not Found", 404));
  } else {
    res.status(200).json({
      sucsess: true,
      product,
    });
  }
});
// Update Product -- Admin

const updateProduct = tryCatchError(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product not Found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true.valueOf,
    useFindAndModify: false,
  });

  res.json({
    success: true,
    product,
  });
});


// Delete Product

const deleteProduct = tryCatchError(async (req, res, next) => {
  let product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new Error("Product not Found", 404));
  } else {
    res.status(200).json({
      sucsess: true,
      message: "product deleted successfully",
    });
  }
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
};
