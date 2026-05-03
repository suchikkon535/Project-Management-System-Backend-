const ApiError = require("./ApiError");

module.exports = (err, req, res, next) => {
  console.log(err);
  

  // Handle known errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle unknown errors safely
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};