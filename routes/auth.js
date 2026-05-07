// express is the framework. Used for routing. If not used, no routes. Alternatives: Other frameworks like Koa.
const express = require('express');

// body from express-validator. Used for validation rules. If not used, no validation. Alternatives: Joi, yup.
const { body } = require('express-validator');

// Import controllers. Used to handle requests. If not used, no handlers. Alternatives: Inline handlers.
const { registerUser, loginUser } = require('../controllers/authController');

// Import validation middleware. Used to check validations. If not used, no validation run. Alternatives: Manual checks.
const validateRequest = require('../middlewares/validateMiddleware');

// Create router. Used to define routes. If not used, no routing. Alternatives: App directly.
const router = express.Router();

// POST route for register. Used to register users. If not used, no registration endpoint. Alternatives: GET, but POST better.
router.post(
  '/register',
  // Array of validations. Used to validate input. If not used, no validation. Alternatives: No validations.
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  // Validation middleware. Used to run validations. If not used, validations not checked. Alternatives: Custom middleware.
  validateRequest,
  // Controller function. Used to process request. If not used, no logic. Alternatives: Different controller.
  registerUser
);

// POST route for login. Used to login users. If not used, no login endpoint. Alternatives: GET.
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);

// Export router. Used to use in app. If not used, routes not available. Alternatives: Export app.
module.exports = router;
