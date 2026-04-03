# Bajarilgan ishlar (DONE)

## Auth
- [x] Login ekrani — telefon raqam kiritish, demo mode, +998 prefix, til tanlash
- [x] OTP Verify ekrani — 6 xonali kod, demo da avtomatik o'tish
- [x] Root layout — auth flash bug tuzatilgan (`ready` state bilan)
- [x] Auth store — Zustand + MMKV (token saqlash)

## Mahsulotlar (Products)
- [x] Mahsulotlar ro'yxati — qidiruv, kam qolgan ogohlantirish (isLowStock)
- [x] Mahsulot qo'shish ekrani — nom, xarid narxi, sotuv narxi, miqdor, birlik
- [x] Mahsulot tahrirlash / ko'rish ekrani (`[id].tsx`) — o'chirish ham bor
- [x] useProducts hook — WatermelonDB reactive query + search filter

## Sotuvlar (Sales)
- [x] Sotuv yozish ekrani — mahsulot qidirish, miqdor +/-, foyda preview
- [x] Sotuv natija ekrani — tushum va sof foyda ko'rsatadi, yana sotuv yozish
- [x] Sotuvlar ro'yxati — Bugun / Hafta / Oy filter
- [x] SaleCard komponenti
- [x] useSales + useTodayStats hooks — WatermelonDB reactive

## Bosh ekran (Home)
- [x] Bugungi tushum, foyda, sotuvlar soni, margin (header)
- [x] Tezkor amallar — Sotuv yozish, Tovar qo'shish
- [x] Oxirgi 8 ta sotuv ro'yxati

## Hisobotlar (Reports)
- [x] Davr filter — Bugun / Hafta / Oy
- [x] Tushum, sof foyda, sotuvlar soni karta
- [x] Rentabellik (margin) progress bar bilan
- [x] Top-5 tovar (foyda bo'yicha) progress bar bilan

## Sozlamalar (Settings)
- [x] Til tanlash — UZ / RU / EN (MMKV da saqlanadi)
- [x] Dark / Light mode toggle (Switch)
- [x] Obuna ekrani — Free / Pro / Biznes tariflar, demo alert
- [x] Chiqish (logout) — alert bilan tasdiqlash

## Ma'lumotlar bazasi (DB)
- [x] WatermelonDB schema — products, sales jadvallar
- [x] Product modeli — name, buyPrice, sellPrice, stockQty, unit, isSynced, serverId, archivedAt
- [x] Sale modeli — productId, productName, qty, sellPrice, profit, note, soldAt, isSynced, serverId
- [x] DB index — database, productsCollection, salesCollection export

## Sync
- [x] Sync engine — isSynced=false yozuvlarni batch API ga yuboradi
- [x] SyncStatus komponenti — header da pending count va status
- [x] Sync store (Zustand) — isSyncing, pendingCount, lastSynced
- [x] AppState "active" bo'lganda runSync() chaqiriladi (_layout.tsx da)

## Store / State
- [x] Auth store (Zustand + MMKV)
- [x] Lang store (Zustand + MMKV)
- [x] Theme store (Zustand + AsyncStorage)
- [x] Sync store (Zustand)
- [x] Data store (Zustand)
- [x] Storage utility (MMKV wrapper)

## i18n (Ko'p til)
- [x] uz.ts — O'zbek
- [x] ru.ts — Rus
- [x] en.ts — English
- [x] i18n index — Lang type, translations map
- [x] useT hook — joriy til tarjimasi
- [x] useTheme hook — c.* rang ob'ekti (light/dark)
- [x] Theme colors (colors.ts)

## Infratuzilma
- [x] Expo SDK 55 + Expo Router (fayl-asosidagi navigatsiya)
- [x] NativeWind + Tailwind sozlamalari
- [x] Babel config (WatermelonDB uchun reanimated plugin)
- [x] API service (Axios, BASE_URL env dan)
- [x] Push notifications service (Expo Go da silent fail)
- [x] App layout — bottom tabs (Bosh, Tovarlar, Sotuv, Hisobot, Sozlamalar)
