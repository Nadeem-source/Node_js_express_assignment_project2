const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require('../controllers/productController');
const protect = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get(
  '/',
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

router.get(
  '/:id',
  [param('id').isInt().withMessage('Product ID must be numeric')],
  validateRequest,
  getProductById
);

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('manufactured_date').isISO8601().withMessage('Manufactured date must be a valid date'),
  ],
  validateRequest,
  createProduct
);

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

router.delete(
  '/:id',
  protect,
  [param('id').isInt().withMessage('Product ID must be numeric')],
  validateRequest,
  deleteProduct
);

router.post(
  '/:id/image',
  protect,
  [param('id').isInt().withMessage('Product ID must be numeric')],
  validateRequest,
  upload.single('image'),
  uploadProductImage
);

module.exports = router;
