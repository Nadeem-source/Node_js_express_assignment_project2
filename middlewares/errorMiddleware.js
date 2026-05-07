// Function for 404 handler. Used to handle not found routes. If not used, no 404 response. Alternatives: Default 404.
function notFound(req, res, next) {
  // Set status to 404. Used to indicate not found. If not used, wrong status. Alternatives: 404 directly in json.
  res.status(404);
  // Call next with error. Used to pass to error handler. If not used, no error handling. Alternatives: Send response.
  next(new Error(`Not Found - ${req.originalUrl}`));
}

// Function for general error handler. Used to handle all errors. If not used, errors not handled. Alternatives: Express default.
function errorHandler(err, req, res, next) {
  // Set status code, default to 500. Used to set appropriate status. If not used, always 500. Alternatives: Always 500.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // Send error response. Used to inform client. If not used, no response. Alternatives: HTML error page.
  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

// Export functions. Used to use in app. If not used, not available. Alternatives: Export default.
module.exports = { notFound, errorHandler };
