const mongoose = require("mongoose"); // Erase if already required
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name! "],
    maxLength: [30, "Don't exceed more than 30 characters"],
    minLenght: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: [validator.isEmail, "Please Enter Valid Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password "],
    minLength: [8, "password should have 8 characters"],
    select: false,
  },

  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordTokenExpired: Date,
});

// Hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }
  const hash = bcrypt.hashSync(this.password, 10);
  this.password = hash;
});


// JWT Token Generates
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password For login user
userSchema.methods.comparePassword = function(enteredPassword){
  return bcrypt.compare(enteredPassword, this.password);
}

//Export the model
module.exports = mongoose.model("User", userSchema);
