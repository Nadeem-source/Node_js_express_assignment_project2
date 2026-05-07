// pool is the database connection pool from config/db.js. Used to get connections for database operations. If not used, no database access. Alternatives: Direct mysql connection, but pool is better for performance.
const pool = require('../config/db');

// Destructuring imports from productModel.js. Used to get model functions for products. If not used, functions not available. Alternatives: Import whole module.
const {
  createProduct: createProductModel,
  getProductById: getProductByIdModel,
  updateProduct: updateProductModel,
  softDeleteProduct,
  findProducts,
} = require('../models/productModel');

// Async function for creating products. Used to handle create requests. If not used, creation not possible. Alternatives: Sync, but async needed.
async function createProduct(req, res, next) {
  // Get connection from pool. Used for transactions. If not used, no transaction. Alternatives: No transaction, but risky.
  const connection = await pool.getConnection();
  // Try block for main logic. Used to handle errors. If not used, errors not caught. Alternatives: No try, but dangerous.
  try {
    // Begin transaction. Used to ensure atomicity. If not used, partial changes possible. Alternatives: No transaction.
    await connection.beginTransaction();
    // Object for product data. Used to structure data. If not used, data scattered. Alternatives: Direct assignments.
    const productData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      manufactured_date: req.body.manufactured_date,
      image_url: req.body.image_url || null,
    };
    // Validation for required fields. Used to check input. If not used, invalid data. Alternatives: Validation middleware.
    if (!req.body.name || !req.body.price || !req.body.quantity || !req.body.manufactured_date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validation for numbers. Used to ensure types. If not used, wrong types. Alternatives: Type checking libraries.
    if (isNaN(req.body.price) || isNaN(req.body.quantity)) {
      return res.status(400).json({ error: "Price and Quantity must be numbers" });
    }
    // Call model to create. Used to insert data. If not used, no creation. Alternatives: Direct SQL.
    const insertId = await createProductModel(productData, connection);
    // Commit transaction. Used to save changes. If not used, changes rolled back. Alternatives: Auto-commit.
    await connection.commit();

    // Send success response. Used to inform client. If not used, no response. Alternatives: Different message.
    res.status(201).json({ message: 'Product created successfully', productId: insertId });
  // Catch for errors. Used to rollback and pass error. If not used, transaction not rolled back. Alternatives: Console error.
  } catch (err) {
    await connection.rollback();
    next(err);
  // Finally to release connection. Used to free resources. If not used, connection leak. Alternatives: No finally, but bad.
  } finally {
    connection.release();
  }
}

// Async function for getting products. Used for list requests. If not used, no listing. Alternatives: Different query.
async function getProducts(req, res, next) {
  try {
    // Options object for filters. Used to parse query params. If not used, no filters. Alternatives: Hardcode filters.
    const options = {
      search: req.query.search || null,
      minPrice: req.query.minPrice != null ? Number(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice != null ? Number(req.query.maxPrice) : null,
      minQuantity: req.query.minQuantity != null ? Number(req.query.minQuantity) : null,
      maxQuantity: req.query.maxQuantity != null ? Number(req.query.maxQuantity) : null,
      manufacturedDate: req.query.manufacturedDate || null,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      page: req.query.page ? Number(req.query.page) : 1,
    };

    // Call model to find products. Used to get data. If not used, no data. Alternatives: Direct query.
    const result = await findProducts(options);
    // Send response with data and pagination. Used to return results. If not used, no response. Alternatives: Simple array.
    res.json({
      data: result.rows,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: Math.ceil(result.total / result.limit)
      },
    });
  } catch (err) {
    next(err);
  }
}

// Async function for getting product by id. Used for single product requests. If not used, no single fetch. Alternatives: Include in list.
async function getProductById(req, res, next) {
  try {
    // Call model to get product. Used to fetch data. If not used, no data. Alternatives: Direct SQL.
    const product = await getProductByIdModel(req.params.id);
    // Check if product exists. Used to handle not found. If not used, null returned. Alternatives: Always return.
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Send product data. Used to return result. If not used, no response. Alternatives: Different format.
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// Async function for updating product. Used for update requests. If not used, no updates. Alternatives: Create new.
async function updateProduct(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Check if product exists. Used to validate. If not used, update non-existent. Alternatives: Update anyway.
    const existing = await getProductByIdModel(req.params.id, connection);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    // Prepare update data. Used to structure. If not used, direct params. Alternatives: req.body directly.
    const productData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      manufactured_date: req.body.manufactured_date,
      image_url: req.body.image_url != null ? req.body.image_url : existing.image_url,
    };

    // Call model to update. Used to modify data. If not used, no change. Alternatives: Direct SQL.
    const updatedRows = await updateProductModel(req.params.id, productData, connection);
    // Check if update succeeded. Used to handle failure. If not used, false positive. Alternatives: Assume success.
    if (!updatedRows) {
      await connection.rollback();
      return res.status(400).json({ error: 'Unable to update product' });
    }

    await connection.commit();
    // Send success message. Used to confirm. If not used, no response. Alternatives: Return updated data.
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// Async function for deleting product. Used for delete requests. If not used, no deletion. Alternatives: Hard delete.
async function deleteProduct(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const existing = await getProductByIdModel(req.params.id, connection);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    // Call model for soft delete. Used to mark deleted. If not used, no delete. Alternatives: Hard delete.
    const deletedRows = await softDeleteProduct(req.params.id, connection);
    if (!deletedRows) {
      await connection.rollback();
      return res.status(400).json({ error: 'Unable to delete product' });
    }

    await connection.commit();
    res.json({ message: 'Product deleted (soft delete) successfully' });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

// Async function for uploading image. Used for image uploads. If not used, no image upload. Alternatives: No image.
async function uploadProductImage(req, res, next) {
  try {
    // Check if file uploaded. Used to validate. If not used, error later. Alternatives: Assume file.
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Check product exists. Used to validate. If not used, update non-existent. Alternatives: Update anyway.
    const product = await getProductByIdModel(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create image URL. Used to store path. If not used, no URL. Alternatives: Full path.
    const imageUrl = `/uploads/${req.file.filename}`;
    // Update product with image. Used to save URL. If not used, image not linked. Alternatives: Separate table.
    const updatedRows = await updateProductModel(req.params.id, { ...product, image_url: imageUrl });
    if (!updatedRows) {
      return res.status(400).json({ error: 'Unable to save product image' });
    }

    // Send success. Used to confirm. If not used, no response. Alternatives: Return URL.
    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (err) {
    next(err);
  }
}

// Export functions. Used to make available to routes. If not used, functions not accessible. Alternatives: Export default.
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
