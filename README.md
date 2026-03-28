# Savdo-E — Production-Ready E-Commerce Platform

Full-stack e-commerce platform with Node.js backend, React web frontend, and React Native mobile app.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js 18+, Express 4, MongoDB (Mongoose), JWT |
| Web | React 18, Vite, Zustand, TanStack Query, Tailwind CSS |
| Mobile | React Native, Expo |
| Auth | JWT Access + Refresh Token rotation |
| Security | Helmet, CORS, Rate Limiting, Joi, mongo-sanitize |

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
# .env is already configured — edit if needed
npm run dev
# → http://localhost:5000
# → http://localhost:5000/health
```

### 2. Web Frontend

```bash
cd web
npm install
npm run dev
# → http://localhost:5173
```

### 3. Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
NODE_ENV=development
JWT_ACCESS_SECRET=<change-in-production>
JWT_REFRESH_SECRET=<change-in-production>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## Features

### Backend
- JWT auth with access + refresh token rotation
- Role-based access control (USER / ADMIN / SUPER_ADMIN)
- Full product management with text search + filtering
- Cart sync with DB, wishlist, order lifecycle management
- Admin dashboard stats (users, orders, revenue)
- Centralized error handling, input validation (Joi), rate limiting

### Web
- Dark / light mode
- Auth-protected routes, admin guard
- Product listing with search, filters, pagination
- Cart, checkout, order placement
- Admin CRUD for products, user management, order status updates
- Skeleton loaders, toast notifications

---

## API Documentation

See [`docs/api.md`](docs/api.md) for full endpoint reference.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for system design, ERD, and security details.

---

## Default Roles

To create an admin user, register normally then update the `role` field directly in MongoDB:
```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "ADMIN" } })
```

---

## License
MIT
