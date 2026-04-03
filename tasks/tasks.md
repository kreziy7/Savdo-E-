# Qilish kerak bo'lgan ishlar (TODO)

## Muhim (Backend tayyorlangandan keyin)
- [ ] Real OTP SMS — backend SMS yuborish API ga ulash (`/auth/send-otp`, `/auth/verify-otp`)
- [ ] Real login token — backend dan JWT token olish va MMKV da saqlash
- [ ] Sync test — backend `/sync/products` va `/sync/sales` endpointlari bilan sinash
- [ ] Push token yuborish — login bo'lgandan keyin `/user/push-token` ga yuborish test qilish

## UI / UX Muammolar
- [ ] `subscription.tsx` — hali `className` ishlatadi (NativeWind), boshqa ekranlar kabi `c.*` theme sistemasiga o'tkazish kerak (dark mode ishlamaydi)
- [ ] Sotuv yozish ekranida hardcoded ranglar bor (`#9AB17A`, `#FBE8CE`) — theme ranglariga o'tkazish
- [ ] Login ekranida hardcoded ranglar bor — theme sistemasiga o'tkazish

## Yangi Funksiyalar
- [ ] Barcode scanner — mahsulot qo'shish/sotuv yozishda kamera bilan shtrix-kod o'qish
- [ ] Hisobot eksport — Excel yoki PDF fayl sifatida yuklash / ulashish
- [ ] Chek (receipt) — sotuvdan keyin chekni share qilish (WhatsApp, Telegram)
- [ ] Mahsulot kategoriyalari — tovarlarni guruhlash
- [ ] Yetkazib beruvchi (supplier) moduli — kimdan, qancha qarzga oldim
- [ ] Qarz daftari — mijoz qarzlari

## Texnik
- [ ] Search uchun debounce qo'shish (hozir har harfda DB query ketadi)
- [ ] Oflayn sync conflict resolution — server va local bir vaqtda o'zgarganda qaysi biri ustun turadi
- [ ] EAS build konfiguratsiya — production APK/IPA chiqarish (eas.json bor, lekin setup kerak)
- [ ] App icon va splash screen — real dizayn, hozir default Expo

## To'lov (Payment)
- [ ] Payme / Click / Uzum integratsiya — Pro va Biznes tarif uchun real to'lov
- [ ] Subscription backend — tarif holati saqlash, muddati tugash tekshirish
- [ ] Tarif limiti — Free da 100 mahsulot, Pro da cheksiz (hozir limit yo'q)

## Multi-user
- [ ] Xodim qo'shish — bir do'konga bir nechta foydalanuvchi
- [ ] Ruxsatlar — xodim faqat sotuv yoza oladi, narxlarni o'zgartira olmaydi
