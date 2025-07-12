// To automatically handle errors in async route handlers without writing repetitive try-catch blocks in every controller.
// I used a wrapper function called wrapASync around all my async route handlers. It lets me avoid repeating try-catch blocks and ensures any async errors are automatically passed to the global Express error handler via next(err). This keeps my controller code clean and production-safe.
export default function wrapASync(fn) {
    // Returns a new function that Express can use as a route handler.
    return function (req, res, next) {
        // Calls the original async function.
        // If it throws an error(e.g.throw new BadRequestError(...)), the.catch(next) sends the error to Express's global error handler (like errorHandler.js).
        fn(req, res, next).catch(next);
    };
};
