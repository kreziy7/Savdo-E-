# 🛒 Savdo-E | MDH Commerce Management Platform 🚀

![Savdo-E](https://img.shields.io/badge/Savdo--E-Premium_Commerce-0B3D2E?style=for-the-badge&logo=shopify&logoColor=white)
![Status](https://img.shields.io/badge/Status-Development-2ECC71?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_1.5-4285F4?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-5_Langs-6C5CE7?style=for-the-badge)

Complete commerce ecosystem for MDH region (Uzbekistan, Kazakhstan, Tajikistan, Kyrgyzstan) with Web, Mobile, and Admin platforms.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Features](#2-core-features)
3. [Platforms](#3-platforms)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Setup & Installation](#6-setup--installation)
7. [API Reference](#7-api-reference)
8. [Roles & Permissions](#8-roles--permissions)
9. [Security](#9-security)
10. [Development Timeline](#10-development-timeline)
11. [Roadmap](#11-roadmap)

---

## 1. Project Overview

**Savdo-E** is an AI-powered commerce management platform designed for 830,000+ traders in the MDH (Central Asia) region. It provides a unified solution across web, mobile, and admin platforms for:

- **Product Management**: Add, edit, and organize inventory
- **Sales Tracking**: Quick sales logging with automatic profit calculation
- **Analytics**: Real-time dashboards and historical reports
- **Offline Support**: Full functionality without internet connection
- **Multi-Language**: 5 languages, 4 countries, 4 currencies
- **AI Integration**: Gemini AI for inventory analysis and business insights
- **Admin Control**: Role-based access with audit logging

### Key Values
✅ **Offline-First** — Works without internet (mobile + web via IndexedDB)
✅ **Fast & Simple** — Log a sale in 3 seconds
✅ **Multi-Region** — UZ, RU, EN + KZ, TJ, KG support
✅ **Scalable** — From 1 store to enterprise
✅ **Secure** — JWT auth, role-based access, audit logging

---

## 2. Core Features

### AI-Powered Assistant
- **Inventory Analysis**: "What's in stock?" → Instant answer
- **Sales Insights**: Trend analysis, profit optimization
- **Natural Language**: Ask in UZ, RU, EN
- **Multi-Purpose**: Analytics, forecasting, recommendations

### Localization (i18n)
- **5 Languages**: UZ (Cyrillic/Latin), RU, EN, KZ, TJ, KG
- **4 Currencies**: UZS, KZT, TJS, KGS (+ RUB, USD)
- **4 Countries**: Uzbekistan, Kazakhstan, Tajikistan, Kyrgyzstan
- **Auto-Detection**: IP-based language/currency selection

### Real-Time Analytics
- Dashboard stats (revenue, profit, inventory)
- Top products analysis
- Daily/weekly/monthly trends
- Export: CSV, Excel, PDF

### Role-Based Access
- **Super Admin**: 1 per system (global settings, admin management)
- **Admin**: Unlimited (user & content management)
- **Custom Roles**: Permission matrix for fine-grained control
- **Audit Logging**: Track all changes with timestamps

---

## 3. Platforms

### 📱 Mobile App (Expo/React Native)
**Purpose**: Quick sales logging, offline operations
**Key Screens**: Login → Dashboard → Products → Sales → Reports
**Tech**: Expo, WatermelonDB (offline), MMKV (tokens), Zustand (state)
**Timeline**: 10 days
**Key Feature**: Works completely offline, syncs automatically when online

---

### 🌐 Web Platform (Next.js)
**Purpose**: Full commerce management, multi-country support

**MVP (8 weeks):**
- Landing page (hero, features, pricing)
- Authentication (phone + SMS OTP)
- Dashboard (stats, charts, activity)
- Products (CRUD with Cloudinary upload)
- Sales (3-second quick input modal)
- Reports (daily/monthly analytics)
- Pricing plans (FREE / STANDARD / PRO)
- Settings (profile, language, currency)

**Phase 2 (V2):**
- Advanced analytics
- Excel/PDF export
- Full multilingual support for all 5 languages

**Tech**: Next.js 14, Tailwind CSS, React Query, next-i18next, IndexedDB
**Timeline**: 8 weeks total

---

### 🖥️ Admin Panel (React/Next.js)
**Purpose**: Platform administration & user management

**Core Modules:**
- Dashboard (system stats, quick actions)
- User Management (CRUD, blocking, search/filter)
- Admin Management (Super Admin only)
- Role & Permissions (matrix, custom roles)
- Reports (system analytics)
- Audit Logs (activity tracking)
- Settings (security, notifications)

**Roles:**
- **Super Admin**: Full access (1 per system)
- **Admin**: Users & content (unlimited)
- **Custom**: Configurable via permission matrix

**Tech**: React 18, TypeScript, React Query, React Hook Form, Recharts
**Timeline**: 5-6 weeks (organized in sprints)

---

## 4. Technology Stack

### Backend (Node.js/Express/MongoDB)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js v18+ | Async, scalable |
| Server | Express.js | Lightweight API |
| Database | MongoDB + Mongoose | Flexible, scalable |
| Auth | JWT + Bcrypt | Stateless security |
| AI | Google Gemini API | Advanced analytics |
| Validation | Joi/Zod | Type safety |
| Logging | Winston/Morgan | Production ready |
| File Storage | Cloudinary | Image management |
| Payment | Payme + Click | MDH payment gateways |

### Web (Next.js 14)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Next.js 14 App Router | SSR, routing, SEO |
| UI | React 18 + Tailwind | Modern, responsive |
| i18n | next-i18next | 5 languages |
| State | TanStack Query + Zustand | Server/client state |
| Forms | React Hook Form + Zod | Validation, type-safe |
| Charts | Recharts | Analytics |
| Offline | IndexedDB + idb-keyval | Persistence |
| Hosting | Vercel | Deployment |

### Mobile (Expo/React Native)
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Expo + React Native | Cross-platform |
| Navigation | Expo Router | File-based routing |
| UI | NativeWind | Tailwind for native |
| Offline DB | WatermelonDB | Local storage + sync |
| State | Zustand | App state |
| Tokens | MMKV | Encrypted storage |
| HTTP | Axios | API requests |

### Admin Panel
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | React 18/Next.js | SPA or SSR |
| UI | Tailwind CSS | Responsive design |
| Tables | TanStack Table v8 | Data grids |
| Forms | React Hook Form | Type-safe validation |
| State | React Query + Zustand | Data fetching |

---

## 5. System Architecture

### High-Level Flow
```
Web/Mobile/Admin Clients
        ↓
  API Gateway (JWT auth, rate limit, CORS)
        ↓
Express.js Backend
        ├─ Auth (JWT + refresh tokens)
        ├─ Products (CRUD)
        ├─ Sales (logging + analytics)
        ├─ Users & Admins (management)
        ├─ Reports (aggregation)
        ├─ AI Integration (Gemini)
        └─ Audit Logging
        ↓
MongoDB Database
        ├─ Users
        ├─ Products
        ├─ Sales
        ├─ Audit Logs
        └─ System Config
```

### Offline Sync (Mobile)
```
User Action (Offline)
        ↓
WatermelonDB (Local Storage)
        ↓
Zustand (App State)
        ↓
Internet Available?
    ├─ YES → Sync Engine → Backend API → Confirm
    └─ NO  → Queue → Retry on reconnect
```

### Database Schema (Key Collections)

**Users:**
```json
{
  _id: ObjectId,
  phone: String (unique),
  name: String,
  email: String,
  role: String (user/admin/super_admin),
  subscription: {
    plan: String,
    status: Boolean,
    expiresAt: Date
  },
  settings: {
    language: String,
    currency: String,
    timezone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Products:**
```json
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  description: String,
  buyPrice: Number,
  sellPrice: Number,
  quantity: Number,
  unit: String,
  image: String (Cloudinary URL),
  category: String,
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

**Sales:**
```json
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  quantity: Number,
  totalPrice: Number,
  profit: Number,
  paymentMethod: String,
  timestamp: Date,
  syncedAt: Date
}
```

**Audit Logs:**
```json
{
  _id: ObjectId,
  userId: ObjectId,
  action: String (CREATE/UPDATE/DELETE/LOGIN),
  entity: String,
  entityId: ObjectId,
  oldValue: Object,
  newValue: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

### Project Structure

```
savdo-e/
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── config/            # DB, env, constants
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, error
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helpers
│   ├── .env
│   └── server.js
│
├── web/                        # Next.js 14 Web App
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   │   ├── (auth)/        # login, verify
│   │   │   └── (dashboard)/   # protected routes
│   │   ├── components/        # Reusable UI
│   │   ├── features/          # Feature modules
│   │   ├── lib/               # Utils & config
│   │   ├── hooks/             # Custom hooks
│   │   └── store/             # Zustand state
│   ├── public/
│   ├── locales/               # i18n translations
│   └── package.json
│
├── mobile/                     # Expo App
│   ├── app/                   # Screens (Expo Router)
│   │   ├── (auth)/
│   │   └── (app)/
│   ├── db/                    # WatermelonDB schema
│   ├── store/                 # Zustand
│   ├── services/              # API, sync engine
│   ├── components/            # Native UI
│   └── package.json
│
├── admin/                      # Admin Panel (React/Next.js)
│   ├── src/
│   │   ├── app/               # Pages
│   │   ├── components/
│   │   │   ├── layout/        # AppLayout, Sidebar, Topbar
│   │   │   ├── shared/        # Button, Input, Modal, etc.
│   │   │   └── guards/        # ProtectedRoute, RoleGuard
│   │   ├── features/          # Feature modules
│   │   └── lib/
│   └── package.json
│
└── docs/                       # Documentation
    ├── API.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

---

## 6. Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas or Local MongoDB
- Google Gemini API Key
- Cloudinary Account
- Payme/Click Merchant Accounts

### Backend Setup
```bash
cd backend
npm install

# Create .env
cat > .env << 'EOF'
PORT=5002
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/savdo_db
JWT_ACCESS_SECRET=your_secret_min_32_chars
JWT_REFRESH_SECRET=your_secret_min_32_chars
GEMINI_API_KEY=AIzaSy...
CLOUDINARY_URL=cloudinary://...
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
EOF

npm run dev
# Server: http://localhost:5002
```

### Web Setup
```bash
cd web

# If new project:
npx create-next-app@latest . --typescript --tailwind --app --src-dir

npm install axios @tanstack/react-query next-i18next idb-keyval zustand recharts

# .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5002/api/v1
NEXT_PUBLIC_DEFAULT_LANGUAGE=uz
NEXT_PUBLIC_DEFAULT_CURRENCY=UZS
EOF

npm run dev
# App: http://localhost:3000
```

### Mobile Setup
```bash
cd mobile

npx create-expo-app . --template blank-typescript
npx expo install expo-router nativewind zustand axios @nozbe/watermelondb react-native-mmkv

# .env.local
EXPO_PUBLIC_API_URL=http://your-backend:5002/api/v1

npx expo start
# Scan QR with Expo Go
```

### Admin Panel Setup
```bash
cd admin
npm install
npm run dev
# App: http://localhost:3001
```

---

## 7. API Reference

### Authentication
```
POST /api/v1/auth/register
  { phone: "+998...", password: "..." }

POST /api/v1/auth/send-otp
  { phone: "+998..." }

POST /api/v1/auth/verify-otp
  { phone: "+998...", otp: "1234" }

POST /api/v1/auth/refresh
  { refreshToken: "..." }

POST /api/v1/auth/logout

GET /api/v1/auth/me
  Headers: { Authorization: "Bearer ..." }
```

### Products
```
GET /api/v1/products?search=&category=&page=1
GET /api/v1/products/:id
POST /api/v1/products
  { name, buyPrice, sellPrice, quantity, unit, image, category }
PATCH /api/v1/products/:id
DELETE /api/v1/products/:id
```

### Sales
```
GET /api/v1/sales?startDate=&endDate=&page=1
POST /api/v1/sales
  { productId, quantity, paymentMethod, timestamp }
GET /api/v1/sales/daily?date=2024-01-01
```

### Reports
```
GET /api/v1/reports/dashboard
GET /api/v1/reports/monthly?month=1&year=2024
POST /api/v1/reports/export
  { format: "csv|excel|pdf", startDate, endDate }
```

### AI
```
POST /api/v1/ai/ask
  { question: "Omborda nima qoldi?" }

POST /api/v1/ai/analyze-sales
  { startDate, endDate }
```

### Admin Only
```
GET /api/v1/admins
POST /api/v1/admins
  { name, email, role, permissions }
PATCH /api/v1/admins/:id
DELETE /api/v1/admins/:id

GET /api/v1/audit-logs?action=&userId=&page=1
```

---

## 8. Roles & Permissions

### Super Admin (1 per system)
| Feature | Access |
|---------|:------:|
| Dashboard | ✅ |
| User Management | ✅ |
| Admin Management | ✅ |
| Role & Permissions | ✅ |
| Products | ✅ |
| Sales | ✅ |
| Reports | ✅ |
| Export | ✅ |
| Audit Logs | ✅ |
| System Settings | ✅ |

### Admin (Unlimited)
| Feature | Access |
|---------|:------:|
| Dashboard | ✅ |
| User Management | ✅ |
| Products | ✅ |
| Sales | ✅ |
| Reports | ✅ |
| Export | ✅ |
| Admin Management | ❌ |
| Audit Logs | ❌ |

### Singleton Rule
- Only **1 Super Admin** allowed in system
- First admin created is Super Admin
- Subsequent admins default to `Admin` role
- UI blocks second Super Admin creation
- Backend enforces via validation

---

## 9. Security

### Authentication
- **JWT Tokens**: Access (15 min) + Refresh (30 days)
- **Bcrypt Hashing**: Password security (10 rounds)
- **HttpOnly Cookies**: Token storage
- **Token Refresh**: Automatic rotation

### API Security
- **Helmet.js**: HTTP headers protection
- **CORS**: Whitelist allowed domains
- **Rate Limiting**: 100 req/min per IP
- **Input Validation**: Joi/Zod schema validation
- **Mongo Sanitize**: NoSQL injection prevention

### Audit & Compliance
- **Audit Logging**: All admin actions tracked
- **IP Tracking**: Log user's IP address
- **User Agent**: Device/browser tracking
- **Timestamp**: Precise action timestamps

---

## 10. Development Timeline

### Mobile (10 days)
| Day | Task | Status |
|-----|------|--------|
| 1 | Expo setup, routing, auth screens | |
| 2 | SMS OTP integration | |
| 3 | WatermelonDB & models | |
| 4 | Products screen (CRUD) | |
| 5 | Sales quick input | |
| 6 | Dashboard & reports | |
| 7 | Offline sync engine | |
| 8 | Backend integration | |
| 9 | Push notifications | |
| 10 | Testing & APK build | |

### Web (8 weeks)
| Week | Task | Status |
|------|------|--------|
| 1 | Next.js setup, i18n, landing, auth | |
| 2 | Dashboard, products CRUD | |
| 3 | Sales modal, reports, offline | |
| 4 | Payme/Click payment integration | |
| 5-6 | KZ/TJ/KG languages, currencies | |
| 7-8 | SEO, optimization, deployment | |

### Admin Panel (5-6 weeks in sprints)
| Sprint | Focus | Status |
|--------|-------|--------|
| 1 | Project setup, design system, auth | |
| 2 | Dashboard, users list & forms | |
| 3 | Admin management, roles | |
| 4 | Reports, settings, profile | |
| 5 | Audit logs, notifications | |

---

## 11. Roadmap

### MVP (Current)
- [x] Authentication (phone + OTP)
- [x] Dashboard & Analytics
- [x] Product Management
- [x] Sales Logging
- [x] Offline Mode
- [x] Multi-language (UZ, RU, EN)
- [x] Admin Panel (basic)

### Phase 2 (V1.1)
- [ ] Advanced Analytics
- [ ] Excel/PDF Export
- [ ] Full multilingual (KZ, TJ, KG)
- [ ] Payment Integration (Payme, Click)
- [ ] Notification Center

### Phase 3 (V1.2)
- [ ] 2FA (2-factor authentication)
- [ ] Real-time Notifications
- [ ] Telegram Bot Integration
- [ ] QR Code Generator
- [ ] Multi-Store Support

### Phase 4 (V2)
- [ ] AI Recommendations
- [ ] Demand Forecasting
- [ ] Supplier Management
- [ ] Expense Tracking
- [ ] Inventory Alerts

---

## Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| Web Hosting (Vercel) | Free | Included plan |
| Backend + DB (Railway) | $10-20 | Scalable |
| Image Storage (Cloudinary) | Free | 25 GB free tier |
| SMS (Eskiz) | ~50-100 | Per transaction |
| Monitoring (Sentry) | Free | 5K errors/month |
| Domain | ~$15 | Annual |
| **Total** | **~$35-50** | Per month |

---

## Contributing

This project is being developed for the MDH region. Contributions welcome for:
- Bug fixes
- Language translations
- Performance optimization
- Security improvements

---

## License

MIT License - Use freely for commercial projects

---

**Savdo-E — Commerce Management Made Simple for MDH 🚀**
