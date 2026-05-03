// utils/ApiError.js

class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "Something went wrong",
    errors = []
  ) {
    super(message);

    this.success = false;
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;