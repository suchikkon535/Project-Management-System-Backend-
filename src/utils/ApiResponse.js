// utils/ApiResponse.js

class ApiResponse {
  constructor(statusCode = 200, message = "Success", data, pagination = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;

    if (data !== undefined && data !== null) {
      this.data = data;
    }
    if (pagination) {
      this.pagination = pagination
    }
  }
}

module.exports = ApiResponse;