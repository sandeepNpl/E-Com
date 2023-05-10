const express = require('express')
const { register, userLogin, logOutUser } = require('../controllers/userController')
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(userLogin)
router.route("/logout").get(logOutUser)

module.exports = router