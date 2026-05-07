// bcrypt is a library used to hash passwords securely, making them unreadable. Used here to protect user passwords during registration and login. If not used, passwords would be stored in plain text, which is very insecure and could lead to data breaches. Alternatives: Use the built-in 'crypto' module for hashing, but bcrypt is specifically designed for passwords and is more secure.
const bcrypt = require('bcryptjs');

// jsonwebtoken is a library for creating and verifying JSON Web Tokens (JWTs). Used to generate tokens for user authentication after login. If not used, there would be no way to securely keep users logged in across requests. Alternatives: Use session-based authentication with cookies, or other token libraries like 'passport-jwt'.
const jwt = require('jsonwebtoken');

// dotenv is a library to load environment variables from a .env file. Used to access sensitive data like JWT_SECRET without hardcoding it. If not used, secrets would be in the code, which is insecure. Alternatives: Hardcode values (not recommended), or use other config libraries.
const dotenv = require('dotenv');

// Destructuring import from userModel.js. Used to get functions for creating users and finding by email. If not used, we'd have to import the whole module or define these functions here. Alternatives: Import the whole module and call userModel.createUser, or use different model functions.
const { createUser, findUserByEmail } = require('../models/userModel');

// Loads environment variables from .env file into process.env. Used to make secrets available. If not used, process.env would not have the values from .env. Alternatives: Set environment variables manually in the system.
dotenv.config();

// Function declaration for generateToken. Used to create a JWT token for a user. If not used, token generation logic would be repeated. Alternatives: Inline the code, or use a different function name.
function generateToken(user) {
  // jwt.sign creates a signed token with payload, secret, and options. Used to encode user info securely. If not used, no token would be created. Alternatives: Use other signing methods, but JWT is standard.
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    // expiresIn sets token expiry. Used to make tokens temporary for security. If not used, tokens would never expire. Alternatives: expiresIn: '7d' for longer expiry.
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

// Async function for registering users. Used to handle user registration requests. If not used, registration wouldn't work. Alternatives: Synchronous function, but async is needed for database operations.
async function registerUser(req, res, next) {
  // Try-catch block to handle errors. Used to catch and pass errors to middleware. If not used, unhandled errors would crash the app. Alternatives: No try-catch, but that's risky.
  try {
    // Destructuring req.body to get name, email, password. Used to extract data from request. If not used, we'd access req.body.name etc. Alternatives: req.body.name directly.
    const { name, email, password } = req.body;
    // If statement to check required fields. Used to validate input. If not used, invalid data could be processed. Alternatives: Use a validation library like joi.
    if (!name || !email || !password) {
      // Return early with error response. Used to stop execution and send error. If not used, code would continue. Alternatives: Throw an error.
      return res.status(400).json({ error: "All fields are required" });
    }

    // If statement to check password length. Used for validation. If not used, weak passwords allowed. Alternatives: Different length requirements.
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Await findUserByEmail to check if user exists. Used to prevent duplicate emails. If not used, duplicates possible. Alternatives: Check after creation.
    const existingUser = await findUserByEmail(email);
    // If existing user, return error. Used to handle duplicates. If not used, would proceed. Alternatives: Update user instead.
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Await bcrypt.hash to hash password. Used to secure password. If not used, plain text password. Alternatives: bcrypt.hashSync for sync.
    const hashedPassword = await bcrypt.hash(password, 10);
    // Await createUser to save user. Used to persist data. If not used, user not saved. Alternatives: Different model function.
    const user = await createUser(name, email, hashedPassword);

    // Send success response. Used to inform client. If not used, no response sent. Alternatives: Different status codes.
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user),
    });
  // Catch block to handle errors. Used to pass to next middleware. If not used, errors not handled. Alternatives: Console.log error.
  } catch (err) {
    next(err);
  }
}

// Async function for login. Used to authenticate users. If not used, login wouldn't work. Alternatives: Different auth method.
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user),
    });
  } catch (err) {
    next(err);
  }
}

// Module exports to make functions available. Used to export to routes. If not used, functions not accessible. Alternatives: Export default.
module.exports = { registerUser, loginUser };
