// I used a custom AppError class in my Express backend to standardize how errors are handled, making it easier to throw meaningful HTTP errors like BadRequest or Unauthorized, and prevent leaking internal details in production

// This file does two main things:
// 1. Defines a centralized errorHandler middleware function for Express.
// 2. Declares custom error classes (AppError, BadRequestError, etc.)that standardize how errors are thrown and handled.

//  This approach prevents leaking sensitive stack traces in production.
// - Centralized error handling.
// - Easy-to-use error classes.
// - Safe for production.
// - Good for debugging.

// Special middleware function in Express (has 4 args: err, req, res, next).
// Catches any error thrown in the app: sync or async failures.
export const errorHandler = (err, req, res, next) => {

  // If the error is an instance of AppError:
  // → It's expected (e.g., input error, unauthorized access).
  // → Send structured JSON response to the client.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  
  // Fallback for unhandled errors
  // If the error is NOT an AppError:
  // → It's likely an unexpected bug or crash.
  // → Log the error and send a generic 500 Internal Server Error response.
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};


// Predefined subclasses of AppError:
// → These simplify usage by hardcoding status codes.

// ConflictError (409):     Use when a conflict occurs (e.g., duplicate email).
// NotFoundError (404):     Use when a resource is not found.
// BadRequestError (400):   Use when input validation fails.
// UnauthorizedError (401): Use when auth token is invalid or missing.

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
  
