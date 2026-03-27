# API Overview

The Savdo-(E) platform uses a RESTful API architecture for communication between clients and the backend.

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.savdo-e.com/api`

## Authentication
The API uses JWT (JSON Web Tokens) for authenticating users. Secure headers must be included for protected endpoints:
`Authorization: Bearer <your_jwt_token>`

## Key API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and receive a token.
- `GET /api/auth/profile`: Get the logged-in user profile. [Protected]

### Products
- `GET /api/products`: List all products (with filters like pagination and category).
- `GET /api/products/:id`: Get detailed information about a product.
- `POST /api/products`: Create a new product. [Admin only]
- `PUT /api/products/:id`: Update an existing product. [Admin only]
- `DELETE /api/products/:id`: Remove a product from the database. [Admin only]

### Categories
- `GET /api/categories`: List all product categories.
- `POST /api/categories`: Add a new category. [Admin only]

### Orders
- `GET /api/orders`: List user's order history. [Protected]
- `POST /api/orders`: Place a new order. [Protected]
- `GET /api/orders/:id`: Get specific order details. [Protected]
- `PATCH /api/orders/:id/status`: Update order status (pending, shipped, delivered). [Admin only]

### Cart
- `GET /api/cart`: Get current user's shopping cart. [Protected]
- `POST /api/cart/add`: Add an item to the cart. [Protected]
- `DELETE /api/cart/:id`: Remove an item from the cart. [Protected]

## Response Format
The API follows standard JSON response conventions:
- **Success**: `{ "success": true, "data": { ... } }`
- **Error**: `{ "success": false, "error": { "message": "Reason for error" } }`

## HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation errors or malformed input.
- `401 Unauthorized`: Authentication required.
- `403 Forbidden`: Insufficient permissions.
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Generic failure during request processing.
