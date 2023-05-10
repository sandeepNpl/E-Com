//!mdbgum
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please Enter Product Name"],
    unique: true,
    index: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please Enter Product description"],
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    maxLength: [8, "price cannot exceed 8 character "],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type:String,
    required:[true,"Please Enter Product category"],
  },

  stock:{
    type:Number,
    required:true,
    maxLength:[4,"Stock cannot exceed 4 character"],
    default:1
  },

  numOfReview:{
    type:Number,
    default:0,
  },

  reviews:[
    {
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true,
        },
        Comment:{
            type:String,
            required:true
        }
    }
  ],

  user:{
    type: mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  },

  createdAt:{
    type:Date,
    default:Date.now
  }
});

//Export the model
module.exports = mongoose.model("Product", productSchema);
