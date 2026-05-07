// validationResult from express-validator. Used to get validation errors. If not used, no error checking. Alternatives: Manual validation.
const { validationResult } = require('express-validator');

// Function to validate request. Used as middleware after validators. If not used, validations not enforced. Alternatives: Inline checks.
function validateRequest(req, res, next) {
  // Get errors. Used to check for validation failures. If not used, no check. Alternatives: Always next.
  const errors = validationResult(req);
  // If errors exist, return them. Used to stop on validation fail. If not used, proceed with invalid data. Alternatives: Log and continue.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => ({ field: err.param, message: err.msg })) });
  }
  // Call next. Used to continue if valid. If not used, request stops. Alternatives: Return.
  next();
}

// Export function. Used to use in routes. If not used, not available. Alternatives: Export as default.
module.exports = validateRequest;
