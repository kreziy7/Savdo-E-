# Savdo — Mobile Ilova

Savdogarlar uchun oflayn-birinchi mobil ilova. Expo + React Native.

## Texnologiyalar

| Texnologiya | Maqsad |
|---|---|
| **Expo Router** | Fayl-asosidagi navigatsiya |
| **WatermelonDB** | Oflayn ma'lumotlar bazasi (SQLite) |
| **MMKV** | Tez token/sozlamalar saqlash |
| **Zustand** | Global state (auth, lang, sync) |
| **NativeWind** | Tailwind-style dizayn |
| **Axios** | Backend API so'rovlari |

## Papka strukturasi

```
mobile/
├── app/
│   ├── _layout.tsx          ← Root layout (auth + sync trigger)
│   ├── (auth)/              ← Kirish ekranlari
│   │   ├── login.tsx        ← Telefon raqam
│   │   └── verify.tsx       ← SMS OTP
│   └── (app)/               ← Asosiy ilova (tab navigation)
│       ├── index.tsx        ← Bosh ekran (bugungi statistika)
│       ├── products/        ← Tovarlar (ro'yxat, qo'shish, tahrirlash)
│       ├── sales/           ← Sotuvlar (ro'yxat, yozish)
│       ├── reports/         ← Hisobotlar (bugun/hafta/oy)
│       └── settings/        ← Sozlamalar (til, tarif, chiqish)
├── db/                      ← WatermelonDB (schema + models)
├── store/                   ← Zustand stores
├── services/                ← API, sync engine, notifications
├── hooks/                   ← useProducts, useSales, useT
├── components/              ← SaleCard, SyncStatus
└── i18n/                    ← uz, ru, en tarjimalar
```

## Ishga tushirish

```bash
cd mobile
npm install
npx expo start
```

Telefonga **Expo Go** o'rnatib, QR kod skanlang.

## APK yasash

```bash
# Test uchun (tez)
eas build --profile preview --platform android

# Play Store uchun
eas build --profile production --platform android
eas submit --platform android
```

## Oflayn ishlash

Barcha sotuv va tovarlar avval **telefonga** (WatermelonDB) yoziladi.
Backend ulanganda `syncEngine` o'zi yuboradi — foydalanuvchi buni ko'rmaydi.
