import ErrorHandler from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "internal server error",
  };

  // handle Mongoose Object ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Handling Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  // handle Mongoose duplicate key Error
  if (err.code === 11000) {
    const message = `Duplicate: ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  // handle wrong jwt Error
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try again!!!`;
    error = new ErrorHandler(message, 400);
  }

  // handle expired jwt Error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired. Try again!!!`;
    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};

export default errorMiddleware;
