# Admin Panel — Modullar Hujjati

Savdo-E Admin Panel mavjud barcha sahifalar va modullarning to'liq tavsifi.

---

## 1. Dashboard (`/dashboard`)

Asosiy boshqaruv paneli — tizim holatini bir ko'rinishda ko'rish.

**Ko'rsatkichlar:**
- Jami foydalanuvchilar soni
- Faol adminlar
- Kontent yozuvlari
- Tizim faolligi (grafik)

**Komponentlar:**
- `StatCard` — bitta ko'rsatkich kartasi
- `ActivityFeed` — oxirgi harakatlar lenti
- `QuickActions` — tez amal tugmalari
- `RecentUsers` — yangi ro'yxatdan o'tganlar

**Backend endpoint:** `GET /api/v1/admin/dashboard/stats`

---

## 2. Foydalanuvchilar (`/users`)

Barcha foydalanuvchilarni ko'rish, qidirish, bloklash va o'chirish.

**Funksiyalar:**
- Ro'yxat (jadval ko'rinishida)
- Qidiruv (ism, email bo'yicha)
- Filter (rol, status bo'yicha)
- Bloklash / blokdan chiqarish
- O'chirish (faqat Super Admin)
- Foydalanuvchi detail sahifasi

**Backend endpointlar:**
```
GET    /api/v1/admin/users?page=&limit=&search=&role=&status=
GET    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id/block
PATCH  /api/v1/admin/users/:id/unblock
DELETE /api/v1/admin/users/:id
```

**Ruxsatlar:** Admin, Super Admin

---

## 3. Adminlar (`/admins`)

Admin foydalanuvchilarni boshqarish (faqat Super Admin uchun).

**Funksiyalar:**
- Admin ro'yxati
- Yangi admin yaratish
- Admin statusini o'zgartirish
- Admin o'chirish

**Backend endpointlar:**
```
GET    /api/v1/admin/admins
POST   /api/v1/admin/admins
PATCH  /api/v1/admin/admins/:id/status
DELETE /api/v1/admin/admins/:id
```

**Ruxsatlar:** Super Admin only

---

## 4. Rollar va Ruxsatlar (`/roles`)

Tizim rollarini va ular ruxsatlarini boshqarish.

**Funksiyalar:**
- Rol kartalarini ko'rish
- Yangi rol yaratish
- Permission matrix (jadval ko'rinishida)
- Rolni o'chirish

**Mavjud ruxsatlar:**
| Ruxsat | Tavsif |
|--------|--------|
| `users.view` | Foydalanuvchilarni ko'rish |
| `users.edit` | Foydalanuvchilarni tahrirlash |
| `users.delete` | Foydalanuvchilarni o'chirish |
| `admins.manage` | Adminlarni boshqarish |
| `roles.manage` | Rollarni boshqarish |
| `content.view` | Kontentni ko'rish |
| `content.edit` | Kontentni tahrirlash |
| `audit.view` | Audit loglarni ko'rish |
| `reports.view` | Hisobotlarni ko'rish |
| `settings.manage` | Sozlamalarni boshqarish |

**Backend endpointlar:**
```
GET    /api/v1/admin/roles
POST   /api/v1/admin/roles
PUT    /api/v1/admin/roles/:id
DELETE /api/v1/admin/roles/:id
GET    /api/v1/admin/permissions
PUT    /api/v1/admin/permissions
```

**Ruxsatlar:** Super Admin only

---

## 5. Kontent Boshqaruvi (`/content`)

Platformadagi barcha kontentni boshqarish.

**Funksiyalar:**
- Kontent ro'yxati (jadval)
- Yangi kontent yaratish
- Kontent tahrirlash
- Status o'zgartirish (draft / published / archived)
- Kontent o'chirish

**Kontent turlari:** Article, Announcement, Help, FAQ

**Backend endpointlar:**
```
GET    /api/v1/admin/content?page=&type=&status=
POST   /api/v1/admin/content
PUT    /api/v1/admin/content/:id
PATCH  /api/v1/admin/content/:id/status
DELETE /api/v1/admin/content/:id
```

**Ruxsatlar:** Admin, Super Admin

---

## 6. Audit Loglar (`/audit-logs`)

Tizimda bajarilgan barcha harakatlarni ko'rish va filtrlash.

**Ko'rsatiladigan ma'lumotlar:**
- Harakat vaqti
- Kim bajardi (admin nomi)
- Harakat turi (CREATE, UPDATE, DELETE, LOGIN, BLOCK)
- Qaysi ob'ektga (user, content, role)
- IP manzil

**Filter imkoniyatlari:**
- Harakat turi bo'yicha
- Sana oralig'i bo'yicha
- Admin bo'yicha

**Backend endpointlar:**
```
GET /api/v1/admin/audit-logs?page=&category=&from=&to=&adminId=
GET /api/v1/admin/audit-logs/export
```

**Ruxsatlar:** Super Admin only

---

## 7. Hisobotlar (`/reports`)

Tizim ko'rsatkichlari va analitika hisobotlari.

**Hisobot turlari:**
- **Overview** — umumiy ko'rsatkichlar
- **Admin faolligi** — har bir admin bajargan amallar
- **Xavfsizlik hisoboti** — login urinishlari, bloklanganlar
- **Kontent hisoboti** — qancha kontent yaratildi/o'chirildi

**Backend endpointlar:**
```
GET /api/v1/admin/reports/overview
GET /api/v1/admin/reports/admin-activity
GET /api/v1/admin/reports/security
GET /api/v1/admin/reports/export
```

**Ruxsatlar:** Admin, Super Admin

---

## 8. Sozlamalar (`/settings`)

Tizim sozlamalari va shaxsiy profil.

**Tablar:**
| Tab | Holat | Tavsif |
|-----|-------|--------|
| Profil | Ishlamoqda | Ism, email, avatar |
| Xabarnomalar | Rejalashtirilgan | Email/push sozlamalari |
| Xavfsizlik | Rejalashtirilgan | Parol, 2FA |
| Tizim | Rejalashtirilgan | Feature flags, session |
| Ko'rinish | Rejalashtirilgan | Dark/Light mode |

**Backend endpointlar:**
```
GET   /api/v1/admin/settings
PATCH /api/v1/admin/settings
PATCH /api/v1/admin/profile
POST  /api/v1/admin/profile/avatar
```

---

## 9. Profil (`/profile`)

Joriy admin profili va shaxsiy ma'lumotlar.

**Ko'rsatiladigan ma'lumotlar:**
- Ism, email, rol
- Yaratilgan sana
- Oxirgi kirish vaqti
- Faol sessiyalar

**Ruxsatlar:** Barcha tizimga kirgan adminlar

---

## Yo'nalishlar Xaritasi (Routes)

```
/login              — Kirish sahifasi (himoyasiz)
/dashboard          — Asosiy panel
/users              — Foydalanuvchilar ro'yxati
/users/:id          — Foydalanuvchi detail
/admins             — Adminlar (Super Admin)
/roles              — Rollar (Super Admin)
/content            — Kontent
/audit-logs         — Audit loglar (Super Admin)
/reports            — Hisobotlar
/settings           — Sozlamalar
/profile            — Profil
```

---

## RBAC — Ruxsatlar Matritsasi

| Sahifa | Admin | Super Admin |
|--------|:-----:|:-----------:|
| Dashboard | ✅ | ✅ |
| Users | ✅ | ✅ |
| Users (delete) | ❌ | ✅ |
| Admins | ❌ | ✅ |
| Roles | ❌ | ✅ |
| Content | ✅ | ✅ |
| Audit Logs | ❌ | ✅ |
| Reports | ✅ | ✅ |
| Settings | ✅ | ✅ |

---

*Yozilgan sana: 2026-04-03*  
*Loyiha: Savdo-E Admin Panel v1.0*
