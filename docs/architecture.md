# Savdo-E Architecture

## System Overview

Monorepo with three clients sharing a single backend API:

```
Savdo-E/
├── backend/          Node.js + Express + MongoDB
├── web/              React 18 + Vite + Zustand + Tailwind CSS
│   └── admin/        Separate admin scaffold (merged into web/src)
├── mobile/           React Native + Expo
└── docs/             This documentation
```

---

## Backend Architecture (Layered)

```
backend/src/
├── config/
│   └── db.js               MongoDB connection with reconnect logic
├── models/
│   ├── User.model.js        Password hashing, address sub-documents
│   ├── RefreshToken.model.js TTL index for auto-expiry
│   ├── Product.model.js     Slug auto-generation, text index, reviews
│   ├── Order.model.js       Auto order number, stock deduction
│   ├── Cart.model.js        Running totals via pre-save hook
│   └── Wishlist.model.js    Product references per user
├── services/               Pure business logic (no HTTP concerns)
│   ├── auth.service.js
│   ├── user.service.js
│   ├── product.service.js
│   ├── cart.service.js
│   ├── wishlist.service.js
│   ├── order.service.js
│   └── admin.service.js
├── controllers/            HTTP layer — delegates to services
├── routes/                 Express routers
│   └── index.js            Central route aggregator
├── middlewares/
│   ├── auth.middleware.js   JWT access token verification
│   ├── rbac.middleware.js   Role-based access control
│   ├── error.middleware.js  Centralized error handler
│   ├── validate.middleware.js Joi schema validation
│   └── rateLimiter.middleware.js express-rate-limit configs
├── validators/             Joi schemas
└── utils/
    ├── ApiError.js          Structured error class
    ├── ApiResponse.js       Structured response class
    ├── asyncHandler.js      Wraps async handlers
    ├── generateTokens.js    JWT generation helpers
    └── logger.js            Winston logger
```

### Request Lifecycle
```
Request → CORS → Helmet → Rate Limit → MongoDB Sanitize
       → Body Parser → Cookie Parser → Route
       → Auth Middleware → RBAC Middleware → Validation
       → Controller → Service → Model → DB
       ← Response ← ApiResponse ← Controller
       ← Error Middleware (on failure)
```

---

## Database Schema (ERD)

```
User
 ├── _id, name, email (unique), password (hashed)
 ├── role: USER | ADMIN | SUPER_ADMIN
 ├── isBlocked, isEmailVerified, lastLogin
 └── addresses[]: { label, street, city, state, country, zipCode, isDefault }

RefreshToken
 ├── user → User._id
 ├── token (unique), expiresAt (TTL indexed)
 └── isRevoked, userAgent, ip

Product
 ├── _id, name, slug (unique), description
 ├── price, discount, finalPrice (computed)
 ├── category (text indexed), brand, tags[]
 ├── images[]: { url, alt }
 ├── stock, isActive
 ├── rating: { average, count }
 ├── reviews[]: { user → User, name, rating, comment }
 └── createdBy → User._id

Order
 ├── _id, orderNumber (unique), user → User._id
 ├── items[]: { product → Product, name, image, price, quantity }
 ├── shippingAddress: { street, city, state, country, zipCode }
 ├── paymentMethod, paymentStatus, orderStatus
 ├── itemsPrice, shippingPrice, taxPrice, totalPrice
 └── paidAt, deliveredAt, notes

Cart (1:1 with User)
 ├── _id, user → User._id (unique)
 ├── items[]: { product → Product, quantity, price }
 └── totalItems, totalPrice (computed on save)

Wishlist (1:1 with User)
 ├── _id, user → User._id (unique)
 └── products[]: → Product._id
```

---

## Frontend Architecture

```
web/src/
├── api/              Axios instance + per-domain API modules
│   ├── axios.js      Token injection + auto-refresh interceptor
│   ├── auth.api.js
│   ├── products.api.js
│   ├── cart.api.js
│   ├── orders.api.js
│   ├── wishlist.api.js
│   └── admin.api.js
├── store/            Zustand global state
│   ├── authStore.js  Persisted via localStorage
│   ├── cartStore.js
│   └── themeStore.js Dark/light mode persisted
├── components/
│   ├── ui/           Button, Input, Badge, Modal, Skeleton, Pagination
│   ├── layout/       Header, Footer, Layout, AdminLayout
│   └── common/       ProductCard, ProtectedRoute
└── pages/
    ├── Home.jsx
    ├── Products.jsx       Filtering + pagination + search
    ├── ProductDetail.jsx  Images, reviews, add to cart
    ├── Cart.jsx
    ├── Checkout.jsx
    ├── Login.jsx / Register.jsx
    ├── Profile.jsx        Tabs: profile, orders, addresses, security
    ├── Wishlist.jsx
    └── admin/
        ├── AdminDashboard.jsx  Stats + recent orders
        ├── AdminProducts.jsx   CRUD with modal
        ├── AdminUsers.jsx      Block/unblock/delete
        └── AdminOrders.jsx     Status management
```

### Auth Flow
1. Login → Store `accessToken` + `refreshToken` in localStorage + Zustand
2. Axios request interceptor injects `Authorization: Bearer <accessToken>`
3. On 401 → Axios interceptor calls `/auth/refresh-token` transparently
4. New tokens stored, original request retried
5. If refresh fails → clear state, redirect to `/login`

---

## Security Measures

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS (production) |
| Headers | Helmet.js (CSP, HSTS, etc.) |
| CORS | Whitelist-only origins |
| Rate Limiting | 100 req/15min global, 10 req/15min auth |
| Input | Joi validation on all mutations |
| NoSQL Injection | express-mongo-sanitize |
| Passwords | bcrypt (12 rounds) |
| Tokens | Short-lived JWT (15m) + rotating refresh (7d) |
| RBAC | Role enforcement on every protected route |

---

## RBAC Matrix

| Resource | USER | ADMIN | SUPER_ADMIN |
|----------|------|-------|-------------|
| Browse products | ✓ | ✓ | ✓ |
| Manage cart/wishlist | ✓ | ✓ | ✓ |
| Place orders | ✓ | ✓ | ✓ |
| View own orders | ✓ | ✓ | ✓ |
| Create/update/delete products | ✗ | ✓ | ✓ |
| View all orders | ✗ | ✓ | ✓ |
| Update order status | ✗ | ✓ | ✓ |
| Block/unblock users | ✗ | ✓ | ✓ |
| Delete users | ✗ | ✗ | ✓ |
| Dashboard stats | ✗ | ✓ | ✓ |
