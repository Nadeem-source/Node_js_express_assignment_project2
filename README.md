# Product CRUD App

A full-stack Node.js + Express + MySQL project for product management with JWT authentication, CRUD operations, image upload, pagination, filtering, search, transactions, and soft delete.

## Features

- User registration and login with JWT
- Add, view, update, and soft-delete products
- Product image upload with local storage
- Pagination, filtering, and search on product list
- Transactional database operations
- Data validation and error handling
- **Premium responsive frontend UI** with modern design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a MySQL database and run the SQL script in `sql/setup.sql`.

3. Create a `.env` file with values from `.env.example`.

4. Start the app:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:4000` in your browser for the full dashboard experience.

## API Endpoints

- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/products` - Get products with optional pagination, filters, and search
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Soft delete product (authenticated)
- `POST /api/products/:id/image` - Upload product image (authenticated)

## Frontend Features

- **Ultra-premium design** with gradients, shadows, and animations
- Responsive layout for all devices
- Real-time search and filtering
- Modal-based editing
- Image upload with drag-and-drop UI
- Professional alerts and notifications
- Smooth transitions and hover effects

## Sample User

A sample admin user is included in the database setup:
- Email: `admin@example.com`
- Password: `password123`

## Notes for beginners

- The app uses local storage for session management
- Images are stored in `public/uploads/`
- Soft delete means products are marked as deleted but kept in database
- All CRUD operations are transactional for data integrity
