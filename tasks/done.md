# Bajarilgan ishlar (DONE) — Savdo-E Mobile

## 1. Loyiha asosi (Boshlang'ich sozlash)

- [x] **Expo + WatermelonDB** — oflayn-birinchi arxitektura o'rnatildi
- [x] **Expo Router** — fayl-asosidagi navigatsiya (`(auth)/`, `(app)/`)
- [x] **NativeWind** — Tailwind CSS mobil uchun sozlandi
- [x] **MMKV** — AsyncStorage o'rniga tez saqlash (token, til, sozlamalar)
- [x] **Zustand** — global state management (auth, lang, sync, role, subscription, theme)
- [x] **Axios** — backend API xizmati (hozircha demo rejimda)
- [x] **i18n** — ko'p tillik tizim: O'zbek, Rus, Ingliz (`i18n/uz.ts`, `ru.ts`, `en.ts`)

---

## 2. Ma'lumotlar bazasi (WatermelonDB)

### Modellar (`db/models/`)
- [x] `Product.ts` — tovar (nom, narx, miqdor, kategoriya, shtrix-kod)
- [x] `Sale.ts` — sotuv yozuvi (tovar, miqdor, narx, vaqt)
- [x] `Category.ts` — mahsulot kategoriyalari (nom, rang)
- [x] `Customer.ts` — mijozlar (qarz daftari)
- [x] `CustomerTransaction.ts` — mijoz tranzaksiyalari
- [x] `Supplier.ts` — yetkazib beruvchilar
- [x] `SupplierTransaction.ts` — yetkazib beruvchi tranzaksiyalari
- [x] `Employee.ts` — xodimlar (ism, rol: admin/kassir)

### Migratsiyalar
- [x] **Migration v1** — Product, Sale asosiy jadvallar
- [x] **Migration v2** — Category, Customer, Supplier, tranzaksiya jadvallari
- [x] **Migration v3** — Employee jadvali qo'shildi

---

## 3. Ekranlar (Screens)

### Auth (`app/(auth)/`)
- [x] `login.tsx` — telefon raqam kiritish, demo rejimda istalgan raqam bilan kirish
- [x] `verify.tsx` — OTP tasdiqlash (backend ulanganda to'liq ishlaydi)

### Asosiy (`app/(app)/`)
- [x] `index.tsx` — Bosh ekran: bugungi tushum, margin, sinxronizatsiya holati

### Mahsulotlar (`products/`)
- [x] `index.tsx` — mahsulotlar ro'yxati, qidiruv (debounce 300ms), kategoriya filter
- [x] `add.tsx` — mahsulot qo'shish (barcode scanner bilan)
- [x] `[id].tsx` — tahrirlash va o'chirish, ruxsat tekshiruvi (admin/kassir)

### Sotuvlar (`sales/`)
- [x] `index.tsx` — sotuv ro'yxati (bugun/hafta/oy filtri)
- [x] `add.tsx` — sotuv yozish (barcode bilan tovar izlash, chek share)

### Hisobotlar (`reports/`)
- [x] `index.tsx` — umumiy hisobot, top-5 tovar, CSV eksport (expo-sharing)

### Mijozlar (`customers/`)
- [x] `index.tsx` — mijozlar ro'yxati, umumiy qarz
- [x] `add.tsx` — mijoz qo'shish
- [x] `[id].tsx` — mijoz qarzi tarixi, to'lov yozish

### Yetkazib beruvchilar (`suppliers/`)
- [x] `index.tsx` — ta'minotchilar ro'yxati, umumiy qarz
- [x] `add.tsx` — ta'minotchi qo'shish
- [x] `[id].tsx` — ta'minotchi tranzaksiyalari

### Sozlamalar (`settings/`)
- [x] `index.tsx` — til tanlash (uz/ru/en), tarif ko'rinishi, chiqish
- [x] `subscription.tsx` — tariflar (Free/Pro/Biznes), Payme/Click demo to'lov
- [x] `employees/index.tsx` — xodimlar ro'yxati
- [x] `employees/add.tsx` — xodim qo'shish, rol belgilash

---

## 4. Store (Zustand)

- [x] `authStore.ts` — token, foydalanuvchi, login/logout
- [x] `langStore.ts` — til (MMKV da saqlanadi)
- [x] `syncStore.ts` — sinxronizatsiya holati (running/idle/error), AppState listener
- [x] `roleStore.ts` — admin/kassir roli, ruxsat tekshiruvi
- [x] `subscriptionStore.ts` — plan (free/pro/biznes), expiresAt, limit tekshiruvi
- [x] `themeStore.ts` — light/dark theme
- [x] `dataStore.ts` — umumiy ma'lumot yordamchilari

---

## 5. Komponentlar

- [x] `BarcodeScanner.tsx` — kamera bilan shtrix-kod o'qish (expo-camera)
- [x] `SaleCard.tsx` — sotuv kartochkasi komponenti
- [x] `SyncStatus.tsx` — sinxronizatsiya holati ko'rsatkichi (bosh ekran headerida)

---

## 6. Funksiyalar

### Barcode Scanner
- [x] Mahsulot qo'shishda shtrix-kod skanerlash
- [x] Sotuv yozishda barcode bilan tez izlash

### Hisobot Eksport
- [x] Sotuvlar CSV formatida eksport (expo-sharing orqali WhatsApp, Telegram, email)

### Chek (Receipt)
- [x] Sotuvdan keyin chek generatsiya va ulashish

### Qarz Daftari
- [x] Mijoz qarzlari (CustomerTransaction modeli)
- [x] Yetkazib beruvchi qarzlari (SupplierTransaction modeli)

### Ruxsatlar (Permissions)
- [x] Admin — hamma imkoniyat
- [x] Kassir — sotuv yozish, ko'rish; tovar qo'shish/tahrirlash/o'chirish yo'q

### Oflayn Sync
- [x] AppState "active" bo'lganda avtomatik `runSync()` chaqiriladi
- [x] **Conflict resolution** — "Last Write Wins": `updatedAt` taqqoslanadi, yangisi qabul qilinadi

### To'lov / Tarif
- [x] **Free** — 30 ta mahsulot limiti
- [x] **Pro** — 250 ta mahsulot
- [x] **Biznes** — cheksiz
- [x] Demo rejimda local upgrade (Payme/Click tugmalari)

---

## 7. UI / Tema

- [x] `theme/` — markaziy rang va stil tizimi (`c.*` sintaksis)
- [x] Barcha ekranlar hardcoded ranglardan → theme sistemasiga o'tkazildi
- [x] Barcha hardcoded matnlar → i18n kalitlariga o'tkazildi
  - `home.todayRevenue`, `home.margin`
  - `products.buyLabel`, `products.sellLabel`, `products.profitLabel`
  - `employees.*` — barcha xodim matnlari
  - `sales.*`, `reports.*`, `settings.*`, `auth.*`

---

## 8. Texnik optimizatsiyalar

- [x] **Debounce** — qidiruv (search) uchun 300ms debounce qo'shildi
- [x] **Reactive queries** — `find()` o'rniga WatermelonDB `observe()` ishlatildi
  - `useProduct`, `useSupplier`, `useCustomer` hooklari
- [x] **Auth flash bug** tuzatildi — root layout `ready` state boshqaruvi

---

## 9. Build / Deploy

- [x] **EAS Build** konfiguratsiyasi to'liq sozlandi (`eas.json`)
  - `development` — dev build (Expo Go bilan)
  - `preview` → `eas build --profile preview --platform android` → APK
  - `production` → `eas build --profile production --platform android` → AAB (Play Store)

---

## Umumiy holat

- Mobile app **to'liq yozilgan**, demo rejimda ishlaydi
- Backend ulanganda sync engine avtomatik ishlaydi
- Backend alohida dasturchi tomonidan qilinadi (bu proyektga tegmaydi)
