const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    // Log lỗi để kiểm tra
    console.log("Error statusCode:", err.statusCode); 
    console.log("Error message:", err.message);
    
    // Đặt giá trị mặc định
    err.statusCode = err.statusCode || 500; 
    err.message = err.message || "Internal Server Error";

    // mongodb id error
    if (err.name === "CastError") {
        const message = `Resource Not Found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid JWT";
        err = new ErrorHandler(message, 401);
    }

    // jwt expire error
    if (err.name === "TokenExpiredError") {
        const message = "JWT is Expired";
        err = new ErrorHandler(message, 401);
    }

    // Đảm bảo statusCode luôn hợp lệ
    if (typeof err.statusCode !== 'number' || !err.message) {
        console.error("Invalid error object:", err);
        err.statusCode = 500;
        err.message = "Internal Server Error";
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
