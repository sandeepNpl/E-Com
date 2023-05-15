const Product = require("../models/productModel");
const tryCatchError = require("../middleware/tryCatchError");
const ApiFeature = require("../utils/apiFeatures");

// Create Product -- Admin
const createProduct = tryCatchError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all product
const getAllProducts = tryCatchError(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
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
      productCount,
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



// Add reviews and ratings for Products
const createProductReviews = tryCatchError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() == req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() == req.user._id.toString()) 
        (rev.rating = rating),
        (rev.comment = comment)
    });

  } else {
    product.reviews.push(review);
    product.numOfReview = product.reviews.length
  }
  
   
  let avg = 0;
   product.reviews.forEach(rev =>{
    avg = avg + rev.rating
  })
 
 product.ratings = avg / product.reviews.length

 product.save({validateBeforeSave:false})

 res.status(200).json({
  success: true,
 })
 
});

// get all reviews 
const getAllReviews = tryCatchError(async(req, res, next)=>{

  const product = await Product.findById(req.query.id)

  if(!product){
    return next(new Error("Product not Found", 404));
  }
 
  res.status(200).json({
    success:true,
    reviews:product.reviews
  })

  });

// Delete reviews

const deleteReview = tryCatchError(async(req, res, next)=>{
 const product = await Product.findById(req.query.productId)

 if(!product){
  return next(new Error("Product not found"))
 }

 const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
 let avg = 0;
   reviews.forEach(rev =>{
    avg = avg + rev.rating
  })
  let  ratings = 0;
  if(reviews.length === 0 ){
      ratings = 0
  }else{
    ratings = avg / product.reviews.length

  }

  const numOfReview = reviews.length
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReview,
  },
  {
    new:true,
    runValidators:true,
    useFindAndModify:true
  })
 
 res.status(200).json({
  success:true,
  message:"Review deleted Successfully"
 })
})


module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReviews,
  deleteReview,
  getAllReviews
};
