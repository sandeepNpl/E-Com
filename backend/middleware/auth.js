const tryCatch = require("./tryCatchError");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

const isAuthenticated = tryCatch(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Error("Please Login to access any resources"), 201);
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRETE);

  req.user = await User.findById(decodedData.id);

  next();
});

const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new Error(`Role: ${req.user.role} is not allowed `));
    }

    next();
  };
};
module.exports = { isAuthenticated, authorizedRoles };
