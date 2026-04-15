# Admin Panel — Sozlash va Ishga Tushirish

**Texnologiya:** React 18 + Vite + Tailwind CSS + React Router v6  
**Port:** `http://localhost:5174`  
**Backend:** `http://localhost:5002/api/v1`

---

## Tezkor Ishga Tushirish

```bash
cd web/admin
npm install
npm run dev
```

Demo kirish ma'lumotlari:
- **Email:** `admin@savdo.uz`
- **Parol:** istalgan (backend bilan bog'langanda haqiqiy parol kerak)

---

## Muhit O'zgaruvchilari (Environment Variables)

`.env` faylni `web/admin/` papkasida yarating:

```env
VITE_API_URL=http://localhost:5002/api/v1
VITE_APP_NAME=Savdo Admin
VITE_APP_VERSION=1.0.0
```

> **Eslatma:** Production uchun `VITE_API_URL` ni real backend URL ga o'zgartiring.

---

## Loyiha Strukturasi

```
web/admin/
├── src/
│   ├── components/
│   │   ├── layout/         # AppLayout, Sidebar, Topbar, Breadcrumb
│   │   └── ui/             # Button, Modal, Badge, Table, Form elements
│   ├── context/
│   │   └── AuthContext.jsx  # JWT auth state (login/logout/user)
│   ├── pages/
│   │   ├── Dashboard.jsx    # Asosiy ko'rsatkichlar + grafiklar
│   │   ├── Users.jsx        # Foydalanuvchilar CRUD
│   │   ├── Admins.jsx       # Admin boshqaruvi
│   │   ├── Roles.jsx        # Rollar va ruxsatlar
│   │   ├── Content.jsx      # Kontent boshqaruvi
│   │   ├── AuditLogs.jsx    # Faoliyat jurnali
│   │   ├── Reports.jsx      # Hisobotlar
│   │   ├── Settings.jsx     # Sozlamalar
│   │   └── Profile.jsx      # Profil
│   ├── services/
│   │   └── api.js           # Axios instance + interceptors
│   ├── theme/
│   │   └── index.jsx        # CSS o'zgaruvchilari (--bg, --text, --accent)
│   ├── App.jsx              # Router + ProtectedRoute
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Skriptlar

| Komanda | Maqsad |
|---------|--------|
| `npm run dev` | Development serverni ishga tushirish |
| `npm run build` | Production uchun build qilish |
| `npm run preview` | Build natijasini local ko'rish |

---

## Backend Ulanishi

Admin panel backend bilan JWT token orqali muloqot qiladi:

1. **Login** → `POST /api/v1/auth/admin/login` → `accessToken` + `refreshToken`
2. **Har bir so'rov** → `Authorization: Bearer <accessToken>` header
3. **Token muddati tugasa** → avtomatik refresh
4. **Refresh muvaffaqiyatsiz** → `/login` ga yo'naltirish

### API Endpointlar (Admin Panel uchun)

```
POST   /api/v1/auth/admin/login
GET    /api/v1/admin/dashboard/stats
GET    /api/v1/admin/users?page=1&limit=20&search=
PATCH  /api/v1/admin/users/:id/block
DELETE /api/v1/admin/users/:id
GET    /api/v1/admin/admins
POST   /api/v1/admin/admins
GET    /api/v1/admin/roles
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/content
GET    /api/v1/admin/reports/overview
```

---

## Deployment

### Vercel (Tavsiya etiladi)

```bash
cd web/admin
npm run build
# dist/ papkasini Vercel ga deploy qiling
```

`vercel.json` (root papkada):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Nginx

```nginx
server {
  listen 80;
  root /var/www/admin/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Muammolar va Yechimlar

| Muammo | Sabab | Yechim |
|--------|-------|--------|
| CORS xatosi | Backend origin ruxsat bermaydi | `CORS_ORIGIN` ga admin URL qo'shing |
| 401 Unauthorized | Token muddati tugagan | Qayta login qiling |
| Sahifa bo'sh | API URL noto'g'ri | `.env` dagi `VITE_API_URL` ni tekshiring |
| Build xatosi | Node.js versiyasi eski | Node.js 18+ o'rnating |

---

*Yozilgan sana: 2026-04-03*  
*Loyiha: Savdo-E Admin Panel*
