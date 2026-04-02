# Analytics & Charts Dashboard

## Maqsad

Admin panelga interaktiv grafiklar va vizual statistika qo'shish orqali biznes ma'lumotlarini tezda tahlil qilish imkonini berish.

## Nima uchun kerak?

Hozirgi dashboard faqat raqamli kartalar ko'rsatadi (umumiy foydalanuvchilar soni, adminlar soni va h.k.). Bu yetarli emas, chunki:

- **Trend ko'rinmaydi** — savdo o'sganmi yoki kamayganligi aniq emas
- **Taqqoslash qiyin** — bu oy va o'tgan oyni solishtirish uchun qo'lda hisoblash kerak
- **Qaror qabul qilish sekinlashadi** — vizual ma'lumot so'zli raqamdan tezroq o'qiladi

## Qo'shiladigan komponentlar

### 1. Savdo Grafigi (Revenue Chart)
```
Tur: Line Chart (chiziq grafik)
Ma'lumot: Kunlik / Haftalik / Oylik daromad
Filtrl: Sana oralig'i (date range picker)
```

### 2. Eng Yaxshi Mahsulotlar (Top Products)
```
Tur: Horizontal Bar Chart
Ma'lumot: Eng ko'p sotilgan 10 ta mahsulot
Filtrl: Kategoriya bo'yicha
```

### 3. Foydalanuvchi O'sishi (User Growth)
```
Tur: Area Chart
Ma'lumot: Yangi ro'yxatga olishlar dinamikasi
Filtrl: Oylik / Yillik
```

### 4. Buyurtmalar Holati (Order Status)
```
Tur: Donut Chart (donut diagramma)
Ma'lumot: Yangi / Tasdiqlangan / Jo'natilgan / Yetkazilgan / Bekor qilingan
```

### 5. Geografik Taqsimot (Geography)
```
Tur: Bar Chart yoki Heatmap
Ma'lumot: Buyurtmalar viloyatlar bo'yicha
```

### 6. Samaradorlik Ko'rsatkichlari (KPI Cards)
```
- Bugungi daromad (o'zgarish % bilan)
- Faol foydalanuvchilar
- Konversiya darajasi
- O'rtacha buyurtma qiymati
```

## Texnik amalga oshirish

### Kutubxona tanlash

**Tavsiya: `recharts`**
- React uchun maxsus yaratilgan
- Tailwind CSS bilan muvofiqlashtiriladi
- Bundle hajmi kichik (~160kb)
- TypeScript qo'llab-quvvatlash

```bash
npm install recharts
```

Muqobil: `chart.js` + `react-chartjs-2`

### Komponent strukturasi

```
src/
  pages/
    dashboard/
      DashboardPage.jsx          (mavjud — kengaytiriladi)
      components/
        RevenueChart.jsx         (yangi)
        TopProductsChart.jsx     (yangi)
        UserGrowthChart.jsx      (yangi)
        OrderStatusChart.jsx     (yangi)
        KpiCard.jsx              (mavjud karta kengaytiriladi)
  services/
    api/
      analytics.api.js           (yangi)
```

### API endpoint (Backend tomonida kerak bo'ladi)

```
GET /api/analytics/revenue?period=monthly&from=2024-01-01&to=2024-12-31
GET /api/analytics/top-products?limit=10
GET /api/analytics/user-growth?period=monthly
GET /api/analytics/order-status
```

## Amalga oshirish vaqti (taxminiy)

| Bosqich | Vaqt |
|---------|------|
| Kutubxona o'rnatish va sozlash | 1 soat |
| KPI karta komponentlari | 2 soat |
| Savdo grafigi | 3 soat |
| Qolgan 4 ta grafik | 8 soat |
| Responsiv dizayn | 2 soat |
| **Jami** | **~16 soat** |

## Ustuvorlik: Yuqori

Bu funksiya Super Admin va Admin har kuni foydalanuvchi bo'lgani uchun tezda amalga oshirish tavsiya etiladi.
