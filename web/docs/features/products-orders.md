# Mahsulotlar, Buyurtmalar va Mijozlar Boshqaruvi

## Maqsad

Savdo platformasining asosiy biznes ob'ektlari — mahsulotlar, buyurtmalar va mijozlar — uchun to'liq CRUD interfeysi yaratish.

## Nima uchun kerak?

Hozir 3 ta sahifa placeholder holida:
- `/products` — bo'sh
- `/orders` — bo'sh
- `/customers` — bo'sh

Bu sahifalar **savdo platformasining yadrosini** tashkil qiladi. Ularsiz admin panel to'liq emas.

---

## A. Mahsulotlar (Products)

### Ro'yxat sahifasi

```
┌───────────────────────────────────────────────────────┐
│  Mahsulotlar (245)              [+ Yangi mahsulot]    │
│  [🔍 Qidirish...]  [Kategoriya ▼] [Holat ▼] [Export] │
│  ─────────────────────────────────────────────────────│
│  ☐  Rasm  Nom              Narx      Qoldiq  Holat    │
│  ☐  📷    iPhone 15 Pro    12,999,000  15    Aktiv    │
│  ☐  📷    Samsung S24      10,500,000   3    Aktiv    │
│  ☐  📷    AirPods Pro       2,990,000   0    Tugagan  │
└───────────────────────────────────────────────────────┘
```

### Mahsulot qo'shish/tahrirlash formi

**Umumiy ma'lumotlar:**
- Nom (uz/en/ru — ko'p tilli)
- Tavsif (rich text editor)
- SKU / Barcode
- Kategoriya (ierarxik — Elektronika > Telefonlar)
- Teglar

**Narx va ombor:**
- Asosiy narx
- Chegirma narxi (va muddati)
- Ombordagi miqdor
- Minimal qoldiq (ogohlantirish chegarasi)

**Rasm va media:**
- Asosiy rasm
- Qo'shimcha rasmlar (gallery)
- Video URL

**SEO:**
- Meta sarlavha
- Meta tavsif
- URL slug (avtomatik generatsiya)

### Kategoriyalar boshqaruvi

```
Elektronika
├── Telefonlar
│   ├── iPhone
│   └── Samsung
├── Noutbuklar
└── Aksessuarlar
```

### Qidiruv va filtrlash

- Nom bo'yicha qidiruv
- Kategoriya filtri
- Narx oralig'i
- Holat (aktiv/nofaol/tugagan)
- Sana oralig'i

---

## B. Buyurtmalar (Orders)

### Ro'yxat sahifasi

```
┌──────────────────────────────────────────────────────────────┐
│  Buyurtmalar (1,234)                           [Export]      │
│  [🔍 Buyurtma ID yoki mijoz]  [Holat ▼] [Sana ▼]           │
│  ──────────────────────────────────────────────────────────  │
│  ID        Mijoz         Sana      Summa      Holat          │
│  #ORD-1234 Alisher T.   01.04.24  450,000   ✅ Yetkazildi   │
│  #ORD-1235 Malika Y.    01.04.24  1,200,000 🔄 Jo'natildi  │
│  #ORD-1236 Jasur K.     02.04.24  89,000    ⏳ Yangi        │
│  #ORD-1237 Nodira S.    02.04.24  250,000   ❌ Bekor        │
└──────────────────────────────────────────────────────────────┘
```

### Holat ketma-ketligi

```
Yangi → Tasdiqlangan → To'lov kutilmoqda → To'landi → Jo'natildi → Yetkazildi
                                                                    ↓
                                                             Qaytarildi
```

### Buyurtma detallar sahifasi `/orders/:id`

**Buyurtma ma'lumotlari:**
- Buyurtma ID, sana, holat
- Holat tarixini o'zgartirish (status timeline)

**Mahsulotlar ro'yxati:**
- Rasm, nom, miqdor, narx, jami

**Mijoz ma'lumotlari:**
- Ism, telefon, email
- Yetkazish manzili (xaritada ko'rsatish)

**To'lov ma'lumotlari:**
- To'lov usuli (naqd, karta, online)
- To'lov holati
- Tranzaksiya ID

**Amallar:**
- Holat o'zgartirish
- Chek (invoice) PDF yuklab olish
- Bekor qilish / Qaytarish

### Filtrlash

- Holat bo'yicha (Yangi/Tasdiqlangan/Jo'natildi/Yetkazildi/Bekor)
- Sana oralig'i
- Narx oralig'i
- To'lov usuli
- Mijoz bo'yicha

---

## C. Mijozlar (Customers)

### Ro'yxat sahifasi

```
┌──────────────────────────────────────────────────────┐
│  Mijozlar (5,678)                      [Export CSV] │
│  [🔍 Ism yoki telefon]  [Holat ▼]  [Toifa ▼]      │
│  ────────────────────────────────────────────────── │
│  Ism            Telefon        Buyurtma  Jami summa │
│  Alisher T.     +998901234567    12      4,500,000  │
│  Malika Y.      +998901234568     3        890,000  │
│  Jasur K.       +998901234569     1         89,000  │
└──────────────────────────────────────────────────────┘
```

### Mijoz profil sahifasi `/customers/:id`

- Shaxsiy ma'lumotlar (ism, email, telefon, tug'ilgan kun)
- Ro'yxatga olish sanasi va oxirgi faollik
- Toifa (VIP, Regular, Yangi)
- Jami buyurtmalar soni va summasi
- Buyurtmalar tarixi
- Saqlangan manzillar
- Bloklash / faollashtirish

### Mijoz toifalash (Segmentation)

| Toifa | Mezon |
|-------|-------|
| VIP | 10+ buyurtma yoki 5,000,000+ so'm |
| Regular | 3-9 buyurtma |
| Yangi | 1-2 buyurtma |
| Nofaol | 6+ oy faoliyatsiz |

---

## Umumiy texnik talablar

### Komponent strukturasi

```
src/
  pages/
    products/
      ProductsPage.jsx           (mavjud placeholder — to'ldiriladi)
      ProductDetailPage.jsx      (yangi)
      components/
        ProductTable.jsx
        ProductModal.jsx
        ProductForm.jsx
        CategoryTree.jsx
    orders/
      OrdersPage.jsx             (mavjud placeholder — to'ldiriladi)
      OrderDetailPage.jsx        (yangi)
      components/
        OrderTable.jsx
        OrderStatusBadge.jsx
        OrderTimeline.jsx
    customers/
      CustomersPage.jsx          (mavjud placeholder — to'ldiriladi)
      CustomerDetailPage.jsx     (yangi)
  services/
    api/
      products.api.js            (yangi)
      orders.api.js              (yangi)
      customers.api.js           (yangi)
```

### Backend API endpointlari

```
# Mahsulotlar
GET    /api/products?page=1&search=&category=&status=
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/images

# Kategoriyalar
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

# Buyurtmalar
GET    /api/orders?page=1&status=&from=&to=
GET    /api/orders/:id
PUT    /api/orders/:id/status
GET    /api/orders/:id/invoice    (PDF)

# Mijozlar
GET    /api/customers?page=1&search=
GET    /api/customers/:id
PUT    /api/customers/:id/status
GET    /api/customers/:id/orders
```

## Amalga oshirish vaqti (taxminiy)

| Qism | Bosqich | Vaqt |
|------|---------|------|
| Mahsulotlar | Jadval + modal | 10 soat |
| Mahsulotlar | Kategoriyalar | 6 soat |
| Buyurtmalar | Jadval + filtrlar | 8 soat |
| Buyurtmalar | Detal sahifasi | 6 soat |
| Mijozlar | Jadval + detal | 8 soat |
| **Jami** | | **~38 soat** |

## Ustuvorlik: Yuqori (Juda muhim)

Bu 3 ta modul savdo platformasining asosiy funksionalligi. Ular bo'lmasdan admin panel to'liq emas.
