// jwt for token verification. Used to decode tokens. If not used, no token check. Alternatives: Other token libs.
const jwt = require('jsonwebtoken');

// Import user model. Used to get user from DB. If not used, no user verification. Alternatives: Cache.
const { findUserById } = require('../models/userModel');

// Empty lines for spacing. Used for readability. If not used, code cramped. Alternatives: No spacing.

// Async protect function. Used as middleware to authenticate. If not used, no auth. Alternatives: Passport.
async function protect(req, res, next) {
  // Get auth header. Used to extract token. If not used, no token. Alternatives: Query param.
  const authHeader = req.headers.authorization;
  // Check header exists and starts with Bearer. Used to validate format. If not used, invalid tokens. Alternatives: Custom header.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or invalid' });
  }

  // Extract token. Used to get token string. If not used, no token. Alternatives: authHeader.slice(7).
  const token = authHeader && authHeader.split(' ')[1];
  // Try block for verification. Used to handle errors. If not used, unhandled errors. Alternatives: Sync verify.
  try {
    // Verify token. Used to decode payload. If not used, no decoding. Alternatives: Custom verify.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by id. Used to get user data. If not used, no user. Alternatives: Cache user.
    const user = await findUserById(decoded.id);
    // Check user exists and not deleted. Used to validate user. If not used, invalid users. Alternatives: Soft delete check.
    if (!user || user.deleted) {
      return res.status(401).json({ error: 'Unauthorized user' });
    }
    // Attach user to req. Used for later use. If not used, no user in req. Alternatives: Res.locals.
    req.user = user;
    // Call next. Used to continue. If not used, request stops. Alternatives: Return.
    next();
  // Catch errors. Used to handle token errors. If not used, crashes. Alternatives: Global error handler.
  } catch (err) {
    // Check if expired. Used for specific message. If not used, generic error. Alternatives: Always generic.
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Export function. Used to use as middleware. If not used, not available. Alternatives: Export object.
module.exports = protect;
