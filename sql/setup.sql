-- Comment for setup.sql: This file sets up the database and tables for the CRUD app. Used to initialize DB. If not used, no DB structure. Alternatives: Manual creation.
-- Create database and tables for product CRUD app
-- CREATE DATABASE: Creates the database if it doesn't exist. Used to ensure DB exists. If not used, DB not created. Alternatives: Manual create.
CREATE DATABASE IF NOT EXISTS product_crud_app;
-- USE: Selects the database. Used to switch to it. If not used, queries on wrong DB. Alternatives: Specify in connection.
USE product_crud_app;

-- CREATE TABLE users: Defines users table. Used for user data. If not used, no users. Alternatives: Different schema.
CREATE TABLE IF NOT EXISTS users (
  -- id: Primary key. Used to uniquely identify users. If not used, no unique ID. Alternatives: UUID.
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- name: User's name. Used to store name. If not used, no name. Alternatives: First and last separate.
  name VARCHAR(100) NOT NULL,
  -- email: User's email. Used for login. If not used, no email. Alternatives: Username.
  email VARCHAR(150) NOT NULL UNIQUE,
  -- password: Hashed password. Used for auth. If not used, no password. Alternatives: Plain text (bad).
  password VARCHAR(255) NOT NULL,
  -- created_at: Timestamp. Used to track creation. If not used, no creation time. Alternatives: No timestamp.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE products: Defines products table. Used for product data. If not used, no products. Alternatives: Different fields.
CREATE TABLE IF NOT EXISTS products (
  -- id: Primary key. Used to identify products. If not used, no ID. Alternatives: UUID.
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- name: Product name. Used to store name. If not used, no name. Alternatives: Code.
  name VARCHAR(255) NOT NULL,
  -- price: Product price. Used for pricing. If not used, no price. Alternatives: Float.
  price DECIMAL(10, 2) NOT NULL,
  -- quantity: Stock quantity. Used for inventory. If not used, no quantity. Alternatives: Unlimited.
  quantity INT NOT NULL,
  -- manufactured_date: Manufacture date. Used for tracking. If not used, no date. Alternatives: No date.
  manufactured_date DATE NOT NULL,
  -- image_url: Image path. Used for images. If not used, no image. Alternatives: Blob.
  image_url VARCHAR(500),
  -- is_deleted: Soft delete flag. Used for soft delete. If not used, hard delete. Alternatives: Hard delete.
  is_deleted TINYINT(1) DEFAULT 0,
  -- created_at: Creation time. Used for tracking. If not used, no time. Alternatives: No.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- updated_at: Update time. Used for tracking changes. If not used, no update time. Alternatives: No.
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Example user for quick testing (password: password123)
-- INSERT: Adds a test user. Used for testing. If not used, no test user. Alternatives: No insert.
INSERT INTO users (name, email, password)
VALUES ('Admin User', 'admin@example.com', '$2a$10$YRGjPsalPnfy2Mqr3i0xa.szV/ETxvsVFd.zuZGe5BjM9ctzME5Oq');
