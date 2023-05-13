const express = require("express");
const {
  register,
  userLogin,
  logOutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateProfile,
  getUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();
const { isAuthenticated, authorizedRoles } = require("../middleware/auth");
const { deleteOne } = require("../models/usersModel");

router.route("/register").post(register);
router.route("/login").post(userLogin);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logOutUser);
router.route("/me").get(isAuthenticated,getUserDetails);
router.route("/me/update/profile").put(isAuthenticated, updateProfile);
router.route("/password/update").put(isAuthenticated,updateUserPassword);
router.route("/get/users").get(isAuthenticated, authorizedRoles("admin"),getUsers);
router.route("/get/single/user/:id").get(isAuthenticated, authorizedRoles("admin"),getSingleUser)
router.route("/update/user/role/:id").put(isAuthenticated, authorizedRoles("admin"),updateUserRole)
router.route("/delet/user/:id").delete(isAuthenticated, authorizedRoles("admin"),deleteUser)



module.exports = router;
