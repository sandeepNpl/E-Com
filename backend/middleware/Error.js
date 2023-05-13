const ErrorHandler = require("../utils/Errorhandler");

module.exports = (err, req, res, next) => {
  err.statudCode = err.statudCode || 500;
  err.message = err.message || "Internal server Error";
  console.log(err)

  res.status(err.statudCode).json({
    success: false,
    message: err.message,
  });

};
