// express for app framework. Used to create server. If not used, no server. Alternatives: Koa, Fastify.
const express = require('express');

// cors for cross-origin. Used to allow requests from other domains. If not used, CORS errors. Alternatives: Manual headers.
const cors = require('cors');

// morgan for logging. Used to log requests. If not used, no logs. Alternatives: Winston.
const morgan = require('morgan');

// dotenv for env vars. Used to load config. If not used, no env. Alternatives: Hardcode.
const dotenv = require('dotenv');

// path for paths. Used to join paths. If not used, string concat. Alternatives: Path.join.
const path = require('path');

// Import auth routes. Used for auth endpoints. If not used, no auth routes. Alternatives: Inline routes.
const authRoutes = require('./routes/auth');

// Import product routes. Used for product endpoints. If not used, no product routes. Alternatives: Inline.
const productRoutes = require('./routes/products');

// Import error middlewares. Used for error handling. If not used, default errors. Alternatives: Custom.
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Load env. Used to set env vars. If not used, process.env empty. Alternatives: Manual.
dotenv.config();

// Create app. Used as main app. If not used, no app. Alternatives: Direct express().
const app = express();

// Use cors. Used to enable CORS. If not used, blocked requests. Alternatives: Specific origins.
app.use(cors());

// Parse JSON. Used to parse JSON bodies. If not used, req.body undefined. Alternatives: Body-parser.
app.use(express.json());

// Parse URL encoded. Used for form data. If not used, form data not parsed. Alternatives: Multer.
app.use(express.urlencoded({ extended: true }));

// Use morgan. Used for request logging. If not used, no logs. Alternatives: Console.log.
app.use(morgan('dev'));

// Serve static files. Used to serve public files. If not used, no static. Alternatives: Nginx.
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads. Used to serve uploaded files. If not used, images not accessible. Alternatives: CDN.
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Commented route for root. Used optionally for homepage. If not used, no root route. Alternatives: Uncomment.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Use not found middleware. Used for 404. If not used, no 404 handling. Alternatives: Default.
app.use(notFound);

// Use error handler. Used for errors. If not used, stack traces. Alternatives: Default.
app.use(errorHandler);

// Set port. Used for server port. If not used, default 3000. Alternatives: 3000.
const PORT = process.env.PORT || 4000;

// Start server. Used to listen. If not used, server not running. Alternatives: App.listen().
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
