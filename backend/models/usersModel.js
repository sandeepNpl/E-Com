const mongoose = require('mongoose'); // Erase if already required
const validator = require('validator')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Your Name! "],
        maxLength:[30, "Don't exceed more than 30 characters"],
        minLenght:[4, "Name should be more than 4 characters"]
       
    },
    email:{
        type:String,
        required:[true, "Please Enter Your Email"],
        validate:[validator.isEmail,]
        unique:true,

    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String, 
        required:true,
        unique:true,
    }
});

//Export the model
module.exports = mongoose.model('User', userSchema);