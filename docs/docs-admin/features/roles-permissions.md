# Roles & Permissions Management

## Maqsad

Admin panelda moslashuvchan rol va ruxsat tizimini yaratish — yangi rollar qo'shish, har bir rolga kerakli ruxsatlarni belgilash.

## Nima uchun kerak?

Hozir tizimda faqat 2 ta qattiq belgilangan rol bor (`admin` va `super_admin`). Bu kichik loyiha uchun yetarli, lekin tizim kengaygan sari cheklovga aylanadi:

- **Yangi bo'limlar uchun yangi rollar kerak** — masalan, `Moderator` (faqat kontent), `Accountant` (faqat hisobotlar), `Support` (faqat mijozlar)
- **Minimal huquq prinsipi** — har bir foydalanuvchi faqat o'z vazifasiga kerakli ruxsatga ega bo'lishi xavfsizlik talab qiladi
- **Moslashuvchanlik** — dasturchi yordamisiz yangi rol yaratish imkonini beradi

## Hozirgi holat

```javascript
// src/store/adminData.js — qattiq kod bilan belgilangan
const BASE_PERMISSIONS = [
  'dashboard.view', 'users.view', 'users.create', ...
]
const PRIMARY_PERMISSIONS = [
  ...BASE_PERMISSIONS, 'admins.manage'
]
```

Bu yondashuv kelajakda o'zgartirib bo'lmaydigan strukturaga olib keladi.

## Yangi arxitektura

### Ruxsatlar matritsasi (Permissions Matrix)

```
Modul          | Ko'rish | Yaratish | Tahrirlash | O'chirish | Eksport
─────────────────────────────────────────────────────────────────────
Dashboard      |   ✓     |    -     |     -      |    -      |   -
Foydalanuvchi  |   ✓     |    ✓     |     ✓      |    ✓      |   ✓
Mahsulotlar    |   ✓     |    ✓     |     ✓      |    ✓      |   ✓
Buyurtmalar    |   ✓     |    -     |     ✓      |    -      |   ✓
Hisobotlar     |   ✓     |    -     |     -      |    -      |   ✓
Audit Logs     |   ✓     |    -     |     -      |    -      |   -
Sozlamalar     |   ✓     |    -     |     ✓      |    -      |   -
```

### Rol CRUD sahifasi `/roles`

```
┌──────────────────────────────────────────────────┐
│  Rollar boshqaruvi              [+ Yangi rol]    │
│  ────────────────────────────────────────────────│
│  Rol nomi       Adminlar soni   Amallar          │
│  Super Admin    1               [Ko'r] [Tahrirl] │
│  Admin          5               [Ko'r] [Tahrirl] │
│  Moderator      3               [Ko'r] [Tahrirl] [O'chir] │
│  Accountant     2               [Ko'r] [Tahrirl] [O'chir] │
└──────────────────────────────────────────────────┘
```

### Rol yaratish / tahrirlash modali

```
┌─────────────────────────────────────────────┐
│  Yangi rol yaratish                     ✕   │
│  ───────────────────────────────────────────│
│  Rol nomi: [___________________]            │
│  Tavsif:   [___________________]            │
│                                             │
│  Ruxsatlar:                                 │
│  Dashboard    [✓] Ko'rish                   │
│  Foydalanuvchi[✓] Ko'rish [✓] Yaratish     │
│               [✓] Tahrirlash [✗] O'chirish  │
│  Mahsulotlar  [✓] Ko'rish [✗] Yaratish     │
│  ...                                        │
│                            [Bekor] [Saqlash]│
└─────────────────────────────────────────────┘
```

## Komponent strukturasi

```
src/
  pages/
    roles/
      RolesPage.jsx              (mavjud placeholder — to'ldiriladi)
      components/
        RoleTable.jsx            (yangi)
        RoleModal.jsx            (yangi)
        PermissionMatrix.jsx     (yangi — checkbox grid)
    permissions/
      PermissionsPage.jsx        (mavjud placeholder — to'ldiriladi)
  constants/
    permissions.js               (yangi — barcha ruxsatlar ro'yxati)
```

### `permissions.js` strukturasi

```javascript
export const PERMISSIONS = {
  dashboard: {
    label: 'Dashboard',
    actions: ['view']
  },
  users: {
    label: 'Foydalanuvchilar',
    actions: ['view', 'create', 'update', 'delete', 'export']
  },
  products: {
    label: 'Mahsulotlar',
    actions: ['view', 'create', 'update', 'delete', 'export']
  },
  orders: {
    label: 'Buyurtmalar',
    actions: ['view', 'update', 'export']
  },
  reports: {
    label: 'Hisobotlar',
    actions: ['view', 'export']
  },
  audit_logs: {
    label: 'Audit Logs',
    actions: ['view']
  },
  settings: {
    label: 'Sozlamalar',
    actions: ['view', 'update']
  },
  admins: {
    label: 'Adminlar',
    actions: ['manage']
  }
}
```

## Backend talablari

```
GET    /api/roles
POST   /api/roles
GET    /api/roles/:id
PUT    /api/roles/:id
DELETE /api/roles/:id
GET    /api/permissions
POST   /api/users/:id/roles    (rol tayinlash)
```

## Amalga oshirish vaqti (taxminiy)

| Bosqich | Vaqt |
|---------|------|
| Permissions constants refaktoring | 2 soat |
| RolesPage va jadval | 4 soat |
| Rol yaratish/tahrirlash modali | 4 soat |
| PermissionMatrix komponenti | 5 soat |
| PermissionsPage | 3 soat |
| **Jami** | **~18 soat** |

## Ustuvorlik: Yuqori

Bu funksiya tizim kengayishi uchun asos bo'lib xizmat qiladi. Tezroq amalga oshirilgan sari boshqa funksiyalar unga tayanishi mumkin.
