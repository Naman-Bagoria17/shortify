export const errorHandler = (err,req,res,next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  
  // Fallback for unhandled errors
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};


export class AppError extends Error {
    statusCode;
    isOperational;//to distinguish between operational error and business logic error.This distinction helps in production:You might log and report non-operational errors to developers.You might safely show operational errors to the user.

    constructor(message, statusCode = 500, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      // Maintains proper stack trace (only available on V8 engines)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class ConflictError extends AppError {
    constructor(message = "Conflict occurred") {
      super(message, 409);
    }
}
  
  export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
      super(message, 404);
    }
  }
  
  export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
      super(message, 400);
    }
  }
  
  export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
      super(message, 401);
    }
  }
  
