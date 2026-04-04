# Bajarilgan ishlar (DONE)

## UI / UX
- [x] `subscription.tsx` — `className` o'rniga `c.*` theme sistemasiga o'tkazildi
- [x] Sotuv yozish ekranida hardcoded ranglar — theme ranglariga o'tkazildi
- [x] Login ekranida hardcoded ranglar — theme sistemasiga o'tkazildi
- [x] i18n — barcha ekranlardagi hardcoded O'zbek/Rus matnlar tarjima tizimiga o'tkazildi
  - home/index.tsx, sales/add.tsx, sales/index.tsx, products/add.tsx, products/index.tsx, products/[id].tsx, login.tsx
  - Yangi kalitlar: `home.todayRevenue`, `home.margin`, `products.buyLabel/sellLabel/profitLabel`, `employees.*`

## Yangi Funksiyalar
- [x] Barcode scanner — mahsulot qo'shish/sotuv yozishda kamera bilan shtrix-kod o'qish
- [x] Hisobot eksport — CSV fayl sifatida expo-sharing orqali ulashish
- [x] Chek (receipt) — sotuvdan keyin chekni share qilish (WhatsApp, Telegram)
- [x] Mahsulot kategoriyalari — tovarlarni guruhlash (kategoriya + rang tanlash)
- [x] Yetkazib beruvchi (supplier) moduli — kimdan, qancha qarzga oldim
- [x] Qarz daftari — mijoz qarzlari
- [x] Xodim qo'shish — settings/employees ekrani, DB modeli (migration v3)
- [x] Ruxsatlar — admin/kassir roli, tovar qo'shish/tahrirlashda permission tekshiruvi

## Texnik
- [x] Search uchun debounce — 300ms debounce qo'shildi
- [x] useProduct / useSupplier / useCustomer — `find()` o'rniga reactive `observe()` ga o'tkazildi
- [x] Oflayn sync conflict resolution — "Last Write Wins" strategiyasi (updatedAt taqqoslash)
  - Conflicts: server yangi bo'lsa server versiyasi qabul qilinadi, local yangi bo'lsa local saqlanadi
- [x] EAS build konfiguratsiya — eas.json to'liq sozlangan (development/preview/production)
  - `eas build --profile preview --platform android` → APK
  - `eas build --profile production --platform android` → AAB (Play Store)

## To'lov
- [x] Tarif limiti — Free da 30, Pro da 250, Biznes da cheksiz (subscriptionStore orqali)
- [x] Subscription local state — useSubscriptionStore, plan + expiresAt AsyncStorage da saqlanadi
- [x] Subscription ekrani — Payme/Click to'lov tugmalari (demo rejimda local upgrade)
