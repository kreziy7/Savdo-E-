/**
 * Wraps async route handlers to catch errors and forward to Express error middleware.
 * @param {Function} fn - Async express route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
