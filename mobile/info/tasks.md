# TASKS — Qilish kerak

## Backend tayyor bo'lgandan keyin (backend boshqa odam qiladi)

- [ ] Real OTP SMS — login ekranida backend `/auth/send-otp` ga ulanish, verify ekranida `/auth/verify-otp` dan real JWT olish
- [ ] Real token saqlash — `authStore.setToken()` backend dan kelgan accessToken + refreshToken bilan chaqirish
- [ ] Sync test — `syncEngine.ts` tayyor, backend `/sync/products` va `/sync/sales` endpointlari tayyor bo'lganda sinash
- [ ] Push token yuborish — login bo'lgandan keyin Expo push token ni `/user/push-token` ga yuborish (`notifications.ts` da qilinadi)
- [ ] Subscription backend — hozir local AsyncStorage da saqlanadi, backendda tarif holati va muddati tekshirilishi kerak
- [ ] Payme / Click to'lov — `subscription.tsx` da URL lar bor (`payme.uz/checkout/...`), lekin real service_id kerak (backend webhook bilan)
- [ ] Xodimlar sync — bir do'konga bir nechta qurilmada xodimlar ko'rinishi (Employee modeli tayyor, sync yo'q)

## Mobile — qolgan texnik ishlar

- [ ] App icon — hozir default Expo icon, real Savdo logotipi kerak (`assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash.png` almashtirish)
- [ ] Splash screen — hozir default, o'zgartirish kerak
- [ ] Xodim PIN login — xodim o'z PIN kodi bilan kirishi va kassir rejimiga o'tishi (roleStore tayyor, lekin PIN flow yo'q)
- [ ] Mahsulot kategoriya filter — `useCategories` hook va `Category` modeli tayyor, lekin mahsulotlar ekranida filter UI yo'q
- [ ] Barcode bilan mahsulot topish — hozir `p.serverId === barcode` bilan qidiradi, lekin mahsulot qo'shishda barcode field bor, to'liqroq qilish kerak
- [ ] Sotuv o'chirish — sotuvlar ro'yxatida o'chirish yo'q (sales/index.tsx da faqat ko'rish bor)
- [ ] Chek formati — hozir text fayl share qiladi, keyinchalik PDF yoki receipt printer support qo'shish mumkin
