const tryCatchError = require("../middleware/tryCatchError");
const ApiFeature = require("../utils/apiFeatures");
const User = require("../models/usersModel");
const sendToken = require("../middleware/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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
    return next(new Error("Invalid Email or  password"), 401);
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
    return next(new Error("User not found !", 404));
  }

  // get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken},`;
  const message = `Your Password reset token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then ignore it `;

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
  } catch (error) {
    user.resetPasswordToken = undefined;
    // user.resetPasswordTokenExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message, 500));
  }
});

// Password Reset Link
const resetPassword = tryCatchError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Error("User Not Found", 404));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Error("Password does not matched ", 400));
  }

  user.password = req.body.password;
  resetPasswordToken: undefined;
  resetPasswordTokenExpired: undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Get Users Details
const getUserDetails = tryCatchError(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user,
  });
});

// Update password
const updateUserPassword = tryCatchError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new Error("Old Password incorrect"), 400);
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new Error("Password does not matched"), 400);
  }

  user.password = req.body.newPassword

   await user.save()
  sendToken(user, 200, res);
});


//Update Profile 
const updateProfile = tryCatchError(async (req, res, next) => {

  const newUserData =  {
    name:req.body.name,
    email:req.body.email,
  }
  // we will add cloudinary later 
  const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
    new:true,
    runValidators: true,
    useFindAndModify: false,
  })
  res.status(200).json({
    success:true,

  })   
});

// Get all users --Admin
const getUsers = tryCatchError(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success:true,
    users
  })
})

// Get Single Users Details -- Admin
const getSingleUser = tryCatchError(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if(!user){
    return next(Error(`User does not exist of this id:${req.params.id}`))
  }
  res.status(200).json({
    success:true,
    user
  })
})



// Update User role 
const updateUserRole = tryCatchError(async (req, res, next) => {

  const newUserData =  {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
    new:true,
    runValidators: true,
    useFindAndModify: false,
  })
  res.status(200).json({
    success:true,

  })   
})


// Delete User -- Admin
const deleteUser = tryCatchError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if(!user){
    return next(Error(`User does not exist with Id:${req.params.id}`))
  }
  res.status(200).json({
    success:true,
    message:"User delete Successfully"
  })
})




module.exports = {
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
  deleteUser
};
