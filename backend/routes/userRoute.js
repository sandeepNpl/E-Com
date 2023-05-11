const express = require('express')
const { register, userLogin, logOutUser, forgotPassword } = require('../controllers/userController')
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(userLogin)
router.route("/password/forgot").post(forgotPassword)
router.route("/logout").get(logOutUser)

module.exports = router