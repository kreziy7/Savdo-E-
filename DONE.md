# DONE — Savdo-E Loyiha Holati

> Sana: 2026-04-16
> Barcha qilingan ishlar, tuzatilgan xatolar va kritik o'zgarishlar

---

## 1. Branch Merge — Jamoaviy kod birlashtirish

### Xasan branch (`origin/Xasan`) → `main`
| Fayl | O'zgarish |
|------|-----------|
| `web/src/pages/Login.jsx` | Premium yangi UI — animatsiyalar, til tanlash, validatsiya |
| `web/src/pages/Register.jsx` | Premium yangi UI — kuchli dizayn |
| `web/src/pages/Settings.jsx` | **Yangi sahifa** — yaratildi |
| `web/src/pages/Dashboard.jsx` | Real ma'lumotlar bilan yangilandi |
| `web/src/pages/Reports.jsx` | Yangilandi |
| `web/src/pages/Sales.jsx` | Yangilandi |
| `web/src/pages/Products.jsx` | Yangilandi |
| `web/src/i18n.js` | UZ / RU / EN — uch tilli qo'llab-quvvatlash |
| `web/src/components/layout/AppLayout.jsx` | Layout yangilandi |

### Abdulaziz branch (`origin/abdulaziz`) → `main`
| Fayl | O'zgarish |
|------|-----------|
| `web/admin/` | **Butun admin panel** — alohida React ilovasi |
| `backend/src/services/admin.service.js` | Dashboard statistika, user/order boshqaruv |
| `backend/src/routes/admin.routes.js` | `/api/v1/admin/*` endpointlar |
| `backend/src/validators/auth.validator.js` | Admin registratsiya validatsiya |
| `backend/src/seedAdmin.js` | Birinchi admin yaratish script |
| `docs/` | Hujjatlar papkasi to'liq to'ldirildi |

---

## 2. Kritik Xatolar — Topildi va Tuzatildi

### KRITIK #1 — JWT_ACCESS_SECRET yo'q edi
- **Muammo:** `secretOrPrivateKey must have a value` — backend login ishlamadi
- **Sabab:** Kod `JWT_ACCESS_SECRET` kutardi, `.env` da faqat `JWT_SECRET` bor edi
- **Yechim:** `.env` ga `JWT_ACCESS_SECRET` qo'shildi
- **Fayl:** `backend/.env`

### KRITIK #2 — Admin panel token refresh buzuq edi
- **Muammo:** Admin panelda token yangilanganda crash bo'lardi
- **Sabab:** `data.token` deb o'qilardi, lekin backend `data.data.accessToken` qaytaradi
- **Yechim:** `data.data?.accessToken || data.accessToken` — ikki holatni qo'llab-quvvatlash
- **Fayl:** `web/admin/src/services/http.js`

### KRITIK #3 — Vite proxy port noto'g'ri edi
- **Muammo:** Web frontend `/api/v1` so'rovlari backendga yetib bormadi
- **Sabab:** `vite.config.js` da proxy target `localhost:5002` ko'rsatilgan, backend `5000` da
- **Yechim:** `5002` → `5000`
- **Fayl:** `web/vite.config.js`

### KRITIK #4 — Admin panel ishlamayotgan edi (port conflict)
- **Muammo:** Admin panel (5174) umuman start bo'lmagan edi
- **Sabab:** Vite config da server.port ko'rsatilmagan, ikkalasi 5173 da to'qnashgan
- **Yechim:** Admin panel uchun port `5174` belgilandi
- **Fayl:** `web/admin/vite.config.js`

### KRITIK #5 — Admin panel API proxy yo'q edi
- **Muammo:** Admin panel `/api/v1` so'rovlari backendga yetib bormadi
- **Sabab:** Admin vite.config.js da proxy sozlamasi yo'q edi
- **Yechim:** `/api` → `http://localhost:5000` proxy qo'shildi
- **Fayl:** `web/admin/vite.config.js`

### KRITIK #6 — Rate limiter barcha so'rovlarni blokladi (429)
- **Muammo:** `Too many requests` — login, API ishlamadi
- **Sabab:** Auth limiter: 10 urinish/15 daqiqa; General limiter: 100 so'rov/15 daqiqa
- **Yechim:** Development rejimda: auth=100, general=1000 urinishga oshirildi
- **Fayl:** `backend/src/middlewares/rateLimiter.middleware.js`

### KRITIK #7 — Backend `.env` fayli yo'q edi
- **Muammo:** Server ishga tushmadi, JWT, MongoDB ishlmadi
- **Sabab:** `.env` fayli hech qachon yaratilmagan edi
- **Yechim:** To'liq `.env` yaratildi
- **Fayl:** `backend/.env` *(gitignore da — xavfsiz)*

### KRITIK #8 — CORS faqat 5173 portga ruxsat berardi
- **Muammo:** Admin panel (5174) backendga so'rov yuborganda CORS xatosi
- **Sabab:** `CORS_ORIGIN=http://localhost:5173` — faqat bitta origin
- **Yechim:** Ikki origin qo'shildi: `5173,5174`
- **Fayl:** `backend/.env`

---

## 3. Integratsiya — Hamma narsa birlashtirildi

### Web Frontend + Backend
- Register → `POST /api/v1/auth/register` ✅
- Login → `POST /api/v1/auth/login` ✅
- Token refresh → `POST /api/v1/auth/refresh-token` ✅
- Barcha sahifalar backend dan real ma'lumot oladi ✅

### Admin panel + Backend
- Admin login → `/api/v1/auth/login` + ADMIN/SUPER_ADMIN tekshiruvi ✅
- Dashboard stats → `GET /api/v1/admin/stats` ✅
- Users boshqaruv → `GET/PATCH/DELETE /api/v1/admin/users` ✅
- Orders boshqaruv → `GET/PATCH /api/v1/admin/orders` ✅

### Bir Login Sistemasi
- Web (`localhost:5173`) login da ADMIN/SUPER_ADMIN kirsa → `/admin` ga yo'naltiriladi
- Oddiy USER kirsa → `/` (dashboard) ga yo'naltiriladi
- Alohida brauzer kerak emas — bir saytda ikkala rol ishlaydi

### Admin Link (Sidebar)
- ADMIN/SUPER_ADMIN foydalanuvchilar sidebar da "Admin Panel" tugmasini ko'radi
- Oddiy user bu tugmani ko'rmaydi

---

## 4. Yangi Sahifalar va Routelar

### Web Frontend (`localhost:5173`)
| URL | Sahifa | Kimga |
|-----|--------|-------|
| `/login` | Login | Hammaga |
| `/register` | Ro'yxatdan o'tish | Hammaga |
| `/` | Dashboard | Login bo'lgan |
| `/products` | Mahsulotlar | Login bo'lgan |
| `/sales` | Savdolar | Login bo'lgan |
| `/reports` | Hisobotlar | Login bo'lgan |
| `/settings` | Sozlamalar | Login bo'lgan |
| `/profile` | Profil | Login bo'lgan |
| `/admin` | Admin Dashboard | ADMIN/SUPER_ADMIN |
| `/admin/users` | Foydalanuvchilar | ADMIN/SUPER_ADMIN |
| `/admin/orders` | Buyurtmalar | ADMIN/SUPER_ADMIN |
| `/admin/products` | Mahsulotlar boshqaruv | ADMIN/SUPER_ADMIN |

### Admin Panel (`localhost:5174`)
| URL | Sahifa |
|-----|--------|
| `/login` | Admin Login |
| `/dashboard` | Bosh sahifa + statistika |
| `/users` | Foydalanuvchilar ro'yxati |
| `/users/:id` | Foydalanuvchi detali |
| `/products` | Mahsulotlar |
| `/orders` | Buyurtmalar |
| `/customers` | Mijozlar |
| `/reports` | Hisobotlar |
| `/roles` | Rollar |
| `/permissions` | Ruxsatlar |
| `/admins` | Admin boshqaruv (SUPER_ADMIN) |
| `/settings` | Sozlamalar |
| `/profile` | Profil |

---

## 5. Docker — To'liq Containerlar

### Yaratilgan Fayllar
| Fayl | Tavsif |
|------|--------|
| `docker-compose.yml` | Barcha 4 serverni boshqaradi |
| `backend/Dockerfile` | Node.js 20 Alpine, 2-stage, non-root user |
| `web/Dockerfile` | Vite build → Nginx |
| `web/admin/Dockerfile` | Vite build → Nginx |
| `web/nginx.conf` | SPA fallback + `/api` proxy |
| `web/admin/nginx.conf` | SPA fallback + `/api` proxy |
| `backend/.dockerignore` | Build optimallashtirish |
| `web/.dockerignore` | Build optimallashtirish |
| `web/admin/.dockerignore` | Build optimallashtirish |
| `.env.docker` | Docker uchun env template |

### Container Portlar
| Container | Port | Manzil |
|-----------|------|--------|
| `savdo_mongo` | 27017 | MongoDB |
| `savdo_backend` | 5000 | API Server |
| `savdo_web` | 3000 | Web Frontend |
| `savdo_admin` | 3001 | Admin Panel |

### Build Natijalari
| Image | Hajm | Holat |
|-------|------|-------|
| `savdo_backend:latest` | 189 MB | ✅ |
| `savdo_web:latest` | 69 MB | ✅ |
| `savdo_admin:latest` | 69 MB | ✅ |

---

## 6. Backend API — To'liq Endpoint Ro'yxati

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/v1/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/v1/auth/login` | Kirish |
| POST | `/api/v1/auth/logout` | Chiqish |
| POST | `/api/v1/auth/refresh-token` | Token yangilash |
| GET | `/api/v1/auth/me` | Mening ma'lumotlarim |
| GET | `/api/v1/products` | Mahsulotlar ro'yxati |
| GET | `/api/v1/cart` | Savat |
| GET | `/api/v1/wishlist` | Sevimliar |
| GET | `/api/v1/orders/my-orders` | Mening buyurtmalarim |
| GET | `/api/v1/sales` | Savdolar |
| GET | `/api/v1/reports/summary` | Hisobot umumiy |
| GET | `/api/v1/reports/daily` | Kunlik hisobot |
| GET | `/api/v1/admin/stats` | Admin statistika |
| GET | `/api/v1/admin/users` | Barcha foydalanuvchilar |
| PATCH | `/api/v1/admin/users/:id/block` | Bloklash |
| PATCH | `/api/v1/admin/users/:id/unblock` | Blokdan chiqarish |
| DELETE | `/api/v1/admin/users/:id` | O'chirish |
| GET | `/api/v1/admin/orders` | Barcha buyurtmalar |
| PATCH | `/api/v1/admin/orders/:id/status` | Status o'zgartirish |
| POST | `/api/v1/admin/register-super-admin` | Super admin yaratish |
| POST | `/api/v1/admin/register-admin` | Admin yaratish |

---

## 7. Admin Kirish Ma'lumotlari

| Role | Email | Parol |
|------|-------|-------|
| SUPER_ADMIN | `superadmin@savdo.uz` | `Admin@1234` |
| ADMIN | `admin@savdo.uz` | `Admin@1234` |

> Admin yaratish: `cd backend && node src/seedAdmin.js`

---

## 8. Loyihani Ishga Tushirish

### Development (lokal)
```bash
# 1. MongoDB (Docker)
docker run -d --name savdo_mongo -p 27017:27017 mongo:7

# 2. Backend
cd backend && node src/server.js

# 3. Web frontend
cd web && npm run dev         # → localhost:5173

# 4. Admin panel
cd web/admin && npm run dev   # → localhost:5174
```

### Docker (barcha servislar)
```bash
# O'rnatish (bir marta)
sudo apt-get install docker-compose-plugin

# Ishga tushirish
docker compose up --build

# Fon rejimda
docker compose up -d --build

# To'xtatish
docker compose down
```

---

## 9. Git Commitlar (bu sessiya)

```
738fb5b  feat(web): redirect ADMIN/SUPER_ADMIN to /admin after login
4eff88b  feat: full integration — web + admin panel + backend connected
c953af4  fix(backend): increase auth rate limit to 100 in development mode
6a44794  fix(admin): add vite proxy to backend, fix favicon 404
48c015a  fix: fix vite proxy port (5002→5000) and add JWT_ACCESS_SECRET to env
54e7b45  feat(docker): add full Docker setup for all services
1799569  feat: merge Xasan & Abdulaziz branches, connect admin panel to backend
```

---

## 10. Loyiha Arxitekturasi (Yakuniy)

```
Savdo-E-/
├── backend/              Node.js + Express + MongoDB
│   ├── src/
│   │   ├── controllers/  Barcha endpoint logikasi
│   │   ├── services/     Biznes logika
│   │   ├── routes/       API routelar (11 ta)
│   │   ├── models/       MongoDB modellar
│   │   ├── middlewares/  Auth, CORS, RateLimit, RBAC
│   │   └── utils/        JWT, ApiError, Logger
│   ├── .env              ← gitignore (maxfiy)
│   └── Dockerfile
│
├── web/                  Web frontend — React + Vite
│   ├── src/
│   │   ├── pages/        Login, Register, Dashboard, Products,
│   │   │   │             Sales, Reports, Settings, Profile
│   │   │   └── admin/    AdminDashboard, AdminUsers,
│   │   │                 AdminOrders, AdminProducts
│   │   ├── store/        Zustand (auth)
│   │   ├── api/          Axios + barcha API chaqiruvlar
│   │   └── components/   Layout, UI komponentlar
│   ├── nginx.conf
│   └── Dockerfile
│
├── web/admin/            Admin panel — React + Vite (alohida ilova)
│   ├── src/
│   │   ├── pages/        Dashboard, Users, Orders, Products,
│   │   │                 Reports, Roles, Permissions, Settings...
│   │   ├── store/        React Context (auth)
│   │   ├── services/     Axios HTTP + barcha API
│   │   └── components/   Sidebar, Header, Modal, Guards
│   ├── nginx.conf
│   └── Dockerfile
│
├── mobile/               React Native (Yahyo — alohida)
├── docs/                 Hujjatlar
├── docker-compose.yml    ← barcha servislarni boshqaradi
└── DONE.md               ← bu fayl
```
