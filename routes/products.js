// express for routing. Used to create router. If not used, no routes. Alternatives: Koa.
const express = require('express');

// Validators from express-validator. Used for input validation. If not used, no validation. Alternatives: Joi.
const { body, param, query } = require('express-validator');

// Import controllers. Used for handling logic. If not used, no handlers. Alternatives: Inline.
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require('../controllers/productController');

// Auth middleware. Used to protect routes. If not used, public access. Alternatives: No auth.
const protect = require('../middlewares/authMiddleware');

// Validation middleware. Used to run validations. If not used, validations skipped. Alternatives: Manual.
const validateRequest = require('../middlewares/validateMiddleware');

// Upload middleware. Used for file uploads. If not used, no uploads. Alternatives: Multer directly.
const upload = require('../middlewares/uploadMiddleware');

// Create router. Used for product routes. If not used, no routing. Alternatives: App routes.
const router = express.Router();

// GET route for products list. Used to fetch products. If not used, no list endpoint. Alternatives: POST.
router.get(
  '/',
  // Validation array for query params. Used to validate filters. If not used, invalid filters. Alternatives: No validation.
  [
    query('page').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('minPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('minPrice must be a valid number'),
    query('maxPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('maxPrice must be a valid number'),
    query('minQuantity').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('minQuantity must be a valid integer'),
    query('maxQuantity').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('maxQuantity must be a valid integer'),
    query('manufacturedDate').optional({ checkFalsy: true }).isISO8601().withMessage('manufacturedDate must be a valid date'),
  ],
  validateRequest,
  protect,
  getProducts
);

// GET route for single product. Used to fetch one product. If not used, no single fetch. Alternatives: Include in list.
router.get(
  '/:id',
  [param('id').isInt().withMessage('Product ID must be numeric')],
  validateRequest,
  getProductById
);

// POST route for creating product. Used to add products. If not used, no create. Alternatives: PUT.
router.post(
  '/',
  protect,
  // Validation for body. Used to validate input. If not used, invalid data. Alternatives: No validation.
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('manufactured_date').isISO8601().withMessage('Manufactured date must be a valid date'),
  ],
  validateRequest,
  createProduct
);

// PUT route for updating product. Used to modify products. If not used, no update. Alternatives: PATCH.
router.put(
  '/:id',
  protect,
  [
    param('id').isInt().withMessage('Product ID must be numeric'),
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('manufactured_date').isISO8601().withMessage('Manufactured date must be a valid date'),
  ],
  validateRequest,
  updateProduct
);

// DELETE route for deleting product. Used to remove products. If not used, no delete. Alternatives: Soft delete only.
router.delete(
  '/:id',
  protect,
  [param('id').isInt().withMessage('Product ID must be numeric')],
  validateRequest,
  deleteProduct
);

// POST route for uploading image. Used to add images. If not used, no image upload. Alternatives: Separate service.
router.post(
  '/:id/image',
  protect,
  [param('id').isInt().withMessage('Product ID must be numeric')],
  validateRequest,
  // Multer upload. Used to handle file. If not used, no file processing. Alternatives: Manual parsing.
  upload.single('image'),
  uploadProductImage
);

// Export router. Used to use in app. If not used, routes not loaded. Alternatives: Export routes array.
module.exports = router;
