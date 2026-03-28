# Savdo-E API Documentation

**Base URL:** `http://localhost:5000/api/v1`

All responses follow this envelope:
```json
{ "success": true, "statusCode": 200, "data": {}, "message": "..." }
```

---

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, returns access+refresh tokens |
| POST | `/auth/refresh-token` | Public | Rotate refresh token |
| POST | `/auth/logout` | Bearer | Logout (revoke refresh token) |
| POST | `/auth/logout-all` | Bearer | Logout all devices |
| GET  | `/auth/me` | Bearer | Get current user |

### Register
```json
POST /auth/register
{ "name": "John Doe", "email": "john@example.com", "password": "Password1" }
```

### Login
```json
POST /auth/login
{ "email": "john@example.com", "password": "Password1" }
Response: { "user": {...}, "accessToken": "...", "refreshToken": "..." }
```

---

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/users/profile` | Bearer | Get profile |
| PATCH  | `/users/profile` | Bearer | Update profile |
| PATCH  | `/users/change-password` | Bearer | Change password |
| POST   | `/users/addresses` | Bearer | Add address |
| PATCH  | `/users/addresses/:id` | Bearer | Update address |
| DELETE | `/users/addresses/:id` | Bearer | Delete address |

---

## Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/products` | Public | List products (paginated, filterable) |
| GET    | `/products/categories` | Public | Get all categories |
| GET    | `/products/slug/:slug` | Public | Get product by slug |
| GET    | `/products/:id` | Public | Get product by ID |
| POST   | `/products` | Admin | Create product |
| PATCH  | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Soft-delete product |
| POST   | `/products/:id/reviews` | Bearer | Add review |

### Query Parameters (GET /products)
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |
| `search` | string | Full-text search |
| `category` | string | Filter by category |
| `minPrice` | number | Minimum final price |
| `maxPrice` | number | Maximum final price |
| `minRating` | number | Minimum average rating |
| `inStock` | boolean | Only in-stock items |
| `sortBy` | string | `price`, `finalPrice`, `rating.average`, `createdAt`, `name` |
| `order` | string | `asc` or `desc` |

---

## Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/cart` | Bearer | Get cart |
| POST   | `/cart/add` | Bearer | `{ productId, quantity }` |
| PATCH  | `/cart/item/:productId` | Bearer | `{ quantity }` |
| DELETE | `/cart/item/:productId` | Bearer | Remove item |
| DELETE | `/cart/clear` | Bearer | Clear cart |

---

## Wishlist

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/wishlist` | Bearer | Get wishlist |
| POST   | `/wishlist/toggle/:productId` | Bearer | Toggle product in/out |
| DELETE | `/wishlist/:productId` | Bearer | Remove product |

---

## Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | `/orders` | Bearer | Create order |
| GET    | `/orders/my-orders` | Bearer | Get user's orders |
| GET    | `/orders/:id` | Bearer | Get single order |
| PATCH  | `/orders/:id/cancel` | Bearer | Cancel order |
| PATCH  | `/orders/:id/status` | Admin | Update order status |

### Create Order Request Body
```json
{
  "items": [{ "product": "<objectId>", "quantity": 2 }],
  "shippingAddress": {
    "street": "123 Main St", "city": "New York",
    "state": "NY", "country": "USA", "zipCode": "10001"
  },
  "paymentMethod": "cash_on_delivery",
  "notes": "Optional note"
}
```

### Order Statuses
`pending` → `paid` → `shipped` → `delivered` | `cancelled`

---

## Admin

Requires `Authorization: Bearer <token>` with role `ADMIN` or `SUPER_ADMIN`.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET    | `/admin/stats` | Admin | Dashboard stats |
| GET    | `/admin/users` | Admin | List all users |
| GET    | `/admin/users/:id` | Admin | Get user |
| PATCH  | `/admin/users/:id/block` | Admin | Block user |
| PATCH  | `/admin/users/:id/unblock` | Admin | Unblock user |
| DELETE | `/admin/users/:id` | SUPER_ADMIN | Delete user |
| GET    | `/admin/orders` | Admin | List all orders |
| PATCH  | `/admin/orders/:id/status` | Admin | Update order status |

### Dashboard Stats Response
```json
{
  "totalUsers": 120,
  "totalProducts": 48,
  "totalOrders": 305,
  "totalRevenue": 18234.50,
  "recentOrders": [...],
  "ordersByStatus": [{ "_id": "pending", "count": 12 }, ...]
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized (token missing/expired) |
| 403  | Forbidden (insufficient role) |
| 404  | Not Found |
| 409  | Conflict (e.g. duplicate email) |
| 422  | Validation Error |
| 429  | Too Many Requests |
| 500  | Internal Server Error |

---

## Rate Limits
- **Global API:** 100 req / 15 min per IP
- **Auth endpoints:** 10 req / 15 min per IP
