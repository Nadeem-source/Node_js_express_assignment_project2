-- Create database and tables for product CRUD app
CREATE DATABASE IF NOT EXISTS product_crud_app;
USE product_crud_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  manufactured_date DATE NOT NULL,
  image_url VARCHAR(500),
  is_deleted TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Example user for quick testing (password: password123)
INSERT INTO users (name, email, password)
VALUES ('Admin User', 'admin@example.com', '$2a$10$YRGjPsalPnfy2Mqr3i0xa.szV/ETxvsVFd.zuZGe5BjM9ctzME5Oq');
