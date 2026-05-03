// middleware/validate.middleware.js

const ApiError = require("../utils/ApiError")

module.exports = ({ body = [] }) => {
  return (req, res, next) => {
    const missingFields = [];

    // 🔹 Check body fields
    for (const field of body) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return next(
        new ApiError(400, "Missing required fields: " + missingFields.join(", "))
      );
    }

    next();
  };
};