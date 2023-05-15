const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReviews,
  getAllReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticated, authorizedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(isAuthenticated, getAllProducts);
router
  .route("/product/new")
  .post(isAuthenticated, authorizedRoles("admin"), createProduct);
router
  .route("/product/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteProduct)
  .get(getProductDetails);

  router.route("/review").put(isAuthenticated,createProductReviews)
  router.route("/reviews").get(getAllReviews).delete(deleteReview)

module.exports = router;
