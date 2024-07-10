// utils/responseHandler.js

// 成功的回應
const successResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};

// 錯誤的回應
const errorResponse = (res, errors, statusCode = 400) => {
  res.status(statusCode).json({
    status: "error",
    errors,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
