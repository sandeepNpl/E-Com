const tryCatchError = require("../middleware/tryCatchError");
const ApiFeature = require("../utils/apiFeatures");
const User = require('../models/usersModel');
const sendToken = require("../middleware/jwtToken");


// Register User 
const register = tryCatchError(async(req, res)=>{
    const {name, email, password} = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is sample public id",
            url:"profilePicUrl",
        }
    })

   sendToken(user, 201, res);
})

// User Login
const userLogin = tryCatchError(async(req, res, next)=>{
    const {email, password} = req.body


    // checking if user has given email and password both
    if(!email || !password){
        return next(new Error("Please Enter your email and passsword"), 403)
    }

    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new Error("Invalid Email or password"), 401)
    }

    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new Error("Invalid Email or password"), 401)
    }

    sendToken(user,200, res);
})


module.exports = {register, userLogin}
