const pool = require('../config/db');
const {
  createProduct: createProductModel,
  getProductById: getProductByIdModel,
  updateProduct: updateProductModel,
  softDeleteProduct,
  findProducts,
} = require('../models/productModel');

async function createProduct(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const productData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      manufactured_date: req.body.manufactured_date,
      image_url: req.body.image_url || null,
    };

    const insertId = await createProductModel(productData, connection);
    await connection.commit();

    res.status(201).json({ message: 'Product created successfully', productId: insertId });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

async function getProducts(req, res, next) {
  try {
    const options = {
      search: req.query.search || null,
      minPrice: req.query.minPrice != null ? Number(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice != null ? Number(req.query.maxPrice) : null,
      minQuantity: req.query.minQuantity != null ? Number(req.query.minQuantity) : null,
      maxQuantity: req.query.maxQuantity != null ? Number(req.query.maxQuantity) : null,
      manufacturedDate: req.query.manufacturedDate || null,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
    };

    const result = await findProducts(options);
    res.json({
      data: result.rows,
      pagination: { total: result.total, page: result.page, limit: result.limit, pages: Math.ceil(result.total / result.limit) },
    });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await getProductByIdModel(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const existing = await getProductByIdModel(req.params.id);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    const productData = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      manufactured_date: req.body.manufactured_date,
      image_url: req.body.image_url != null ? req.body.image_url : existing.image_url,
    };

    const updatedRows = await updateProductModel(req.params.id, productData, connection);
    if (!updatedRows) {
      await connection.rollback();
      return res.status(400).json({ error: 'Unable to update product' });
    }

    await connection.commit();
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

async function deleteProduct(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const existing = await getProductByIdModel(req.params.id);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

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

async function uploadProductImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const product = await getProductByIdModel(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const updatedRows = await updateProductModel(req.params.id, { ...product, image_url: imageUrl });
    if (!updatedRows) {
      return res.status(400).json({ error: 'Unable to save product image' });
    }

    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
