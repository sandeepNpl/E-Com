const tryCatchError = require("../middleware/tryCatchError");
const ApiFeature = require("../utils/apiFeatures");
const User = require("../models/usersModel");
const sendToken = require("../middleware/jwtToken");
const sendEmail = require("../utils/sendEmail");

// Register User
const register = tryCatchError(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample public id",
      url: "profilePicUrl",
    },
  });

  sendToken(user, 201, res);
});

// User Login
const userLogin = tryCatchError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given email and password both
  if (!email || !password) {
    return next(new Error("Please Enter your email and passsword"), 403);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Error("Invalid Email or password"), 401);
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new Error("Invalid Email or password"), 401);
  }

  sendToken(user, 200, res);
});

// Logout User

const logOutUser = tryCatchError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot password
const forgotPassword = tryCatchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
   return  next(new Error("User not found !", 404));
  }
  
  // get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset/password/${resetToken},`;
  const message = `Your Password reset token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then ignore it `;
  console.log(user.email);

  try {
      await sendEmail({
        email: user.email,
        subject: `Ecom password recovery`,
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email is sent to ${user.email} successfully`,
      });
  }catch (error) {

    user.resetPasswordToken = undefined;
    // user.resetPasswordTokenExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message, 500));
  }
});

module.exports = { register, userLogin, logOutUser, forgotPassword };
