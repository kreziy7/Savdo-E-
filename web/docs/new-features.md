# Admin Panelga Qo'shish Mumkin Bo'lgan Yangi Funksiyalar

> Hozirgi holat: Admin panel asosiy funksiyalarga ega (Dashboard, Foydalanuvchilar, Adminlar, Kontent, Audit Logs).
> Quyida ushbu panelni yanada kuchliroq qilish uchun tavsiya etiladigan yangi funksiyalar ro'yxati keltirilgan.

---

## Xulosa jadvali

| # | Funksiya | Muhimlik | Holat |
|---|----------|----------|-------|
| 1 | Analytics & Charts Dashboard | Yuqori | Yo'q |
| 2 | Real-time Notification Center | Yuqori | Qisman |
| 3 | Roles & Permissions Management | Yuqori | Placeholder |
| 4 | Mahsulotlar boshqaruvi (Products) | Yuqori | Placeholder |
| 5 | Buyurtmalar boshqaruvi (Orders) | Yuqori | Placeholder |
| 6 | Mijozlar boshqaruvi (Customers) | O'rta | Placeholder |
| 7 | 2FA — Ikki bosqichli autentifikatsiya | Yuqori | Yo'q |
| 8 | Ma'lumot Eksport / Import | O'rta | Yo'q |
| 9 | Bulk Actions (Ommaviy amallar) | O'rta | Yo'q |
| 10 | Kengaytirilgan qidiruv va filtrlar | O'rta | Minimal |
| 11 | Profil sahifasini to'ldirish | O'rta | Placeholder |
| 12 | Sozlamalar sahifasini to'ldirish | O'rta | Placeholder |
| 13 | Email shablonlari boshqaruvi | Past | Yo'q |
| 14 | API kalitlar boshqaruvi | Past | Yo'q |
| 15 | Tizim salomatligi monitori | Past | Yo'q |

---

## 1. Analytics & Charts Dashboard

**Nima:** Dashboard sahifasiga grafiklar, diagrammalar va vizual statistika qo'shish.

**Nima uchun kerak:**
- Hozirgi dashboard faqat raqamli kartalar ko'rsatadi — trend va o'zgarishlarni ko'rish qiyin
- Biznes qarorlar qabul qilish uchun vizual ma'lumotlar muhim
- Savdo o'sishi, foydalanuvchi aktivligi, buyurtmalar hajmini grafik ko'rinishda tahlil qilish imkonini beradi

**Qanday funksiyalar:**
- Kunlik/haftalik/oylik savdo grafigi (Line Chart)
- Eng ko'p sotilgan mahsulotlar (Bar Chart)
- Foydalanuvchilar ro'yxatga olish dinamikasi (Area Chart)
- Buyurtmalar holati taqsimoti (Pie/Donut Chart)
- Daromad vs xarajat taqqoslash (Dual Bar Chart)

**Kutubxonalar:** `recharts` yoki `chart.js` + `react-chartjs-2`

Batafsil: [features/analytics.md](./features/analytics.md)

---

## 2. Real-time Notification Center

**Nima:** Tizimda yangi hodisalar bo'lganda admin darhol xabar oladigan notification tizimi.

**Nima uchun kerak:**
- Admin muhim hodisalardan (yangi buyurtma, xato, bloklangan foydalanuvchi) kechikmasdan xabar topishi kerak
- Hozir faqat statik mock notifikatsiyalar mavjud
- Real vaqt rejimida kuzatuv adminning ishini tezlashtiradi

**Qanday funksiyalar:**
- Header'da qo'ng'iroq belgisi bilan yangi bildirishnomalar soni
- Notification dropdown paneli (o'qilgan/o'qilmagan)
- Bildirishnomalarni filter qilish (tur bo'yicha: tizim, buyurtma, foydalanuvchi)
- WebSocket yoki SSE orqali real-time yangilanish
- Push notification (brauzer)
- Email notification sozlamalari

**Texnologiya:** WebSocket (`socket.io-client`) yoki Server-Sent Events

Batafsil: [features/notifications.md](./features/notifications.md)

---

## 3. Roles & Permissions Management

**Nima:** Adminlarga maxsus rollar yaratish va har bir rolga ruxsatlar belgilash imkoniyati.

**Nima uchun kerak:**
- Hozir faqat 2 ta qattiq kod bilan belgilangan rol bor (Admin, Super Admin)
- Katta loyihalarda turli bo'limlar uchun turli rolllar kerak bo'ladi (Moderator, Editor, Accountant va h.k.)
- Har bir admin faqat o'z vazifasiga mos funksiyalarga kirishi xavfsizlikni oshiradi

**Qanday funksiyalar:**
- Yangi rol yaratish / tahrirlash / o'chirish
- Rol uchun ruxsatlar (permissions) check-box orqali belgilash
- Foydalanuvchiga bir nechta rol tayinlash
- Rol matritsasi jadval ko'rinishida (modul × amal = ruxsat)
- Rol nusxa olish (clone)

Batafsil: [features/roles-permissions.md](./features/roles-permissions.md)

---

## 4. Mahsulotlar Boshqaruvi (Products)

**Nima:** Savdo platformasidagi mahsulotlarni to'liq boshqarish sahifasi.

**Nima uchun kerak:**
- Hozir `/products` sahifasi faqat placeholder
- Savdo platformasining asosiy maqsadi mahsulot sotish — bu sahifa markaziy bo'lishi kerak
- Admin mahsulot qo'shish, tahrirlash, narx belgilash, kategoriya tayinlash qila olishi kerak

**Qanday funksiyalar:**
- Mahsulotlar jadval ko'rinishida (rasm, nom, narx, kategoriya, qoldiq, holat)
- Yangi mahsulot qo'shish formi (multi-step yoki modal)
- Rasm yuklash (drag & drop)
- Kategoriya va teglar boshqaruvi
- Narx tarixi
- Ombor qoldig'ini boshqarish
- Mahsulotni aktiv/nofaol qilish
- Bulk delete / bulk status change
- SKU / barcode qo'llab-quvvatlash

Batafsil: [features/products-orders.md](./features/products-orders.md)

---

## 5. Buyurtmalar Boshqaruvi (Orders)

**Nima:** Mijozlarning buyurtmalarini kuzatish va boshqarish sahifasi.

**Nima uchun kerak:**
- Hozir `/orders` sahifasi placeholder
- Buyurtmalar savdo biznesining kalitidir — admin ularni ko'rishi, o'zgartirishi va kuzatishi lozim
- Yetkazib berish holati, to'lov holati, qaytarish jarayonlarini boshqarish kerak

**Qanday funksiyalar:**
- Buyurtmalar jadval ko'rinishi (ID, mijoz, sana, summa, holat)
- Holat filtrlari (yangi, tasdiqlangan, jo'natilgan, yetkazilgan, bekor qilingan)
- Buyurtma detallari sahifasi (mahsulotlar, to'lov, manzil)
- Holat o'zgartirish (status update)
- Buyurtmani bekor qilish / qaytarish
- Chek (invoice) PDF sifatida yuklab olish
- Buyurtmalar grafikli hisoboti

Batafsil: [features/products-orders.md](./features/products-orders.md)

---

## 6. Mijozlar Boshqaruvi (Customers)

**Nima:** Platforma mijozlarini (oxirgi foydalanuvchilar) boshqarish.

**Nima uchun kerak:**
- Hozirgi `/customers` sahifasi placeholder
- Foydalanuvchilar sahifasi admin/user uchun, mijozlar esa alohida segment
- Mijoz tarixi, buyurtmalari, segmentlash biznes uchun muhim

**Qanday funksiyalar:**
- Mijozlar ro'yxati (ism, email, telefon, ro'yxatga olish sanasi, jami buyurtmalar)
- Mijoz profil sahifasi (buyurtmalar tarixi, adreslar, to'lov usullari)
- Mijozni bloklash / faollashtirish
- Mijoz toifalash (VIP, regular, yangi)
- Mijozlarga xabar yuborish (email/SMS)
- Export CSV

---

## 7. Ikki Bosqichli Autentifikatsiya (2FA)

**Nima:** Admin hisobiga kirish uchun ikkinchi tekshiruv qatlami.

**Nima uchun kerak:**
- Admin panelga ruxsatsiz kirish juda xavfli — barcha tizim ma'lumotlari ochilishi mumkin
- Ko'plab xavfsizlik standartlari (ISO 27001, GDPR) 2FA ni talab qiladi
- Parol o'g'irlansa ham, 2FA ikkinchi himoya vazifasini bajaradi

**Qanday funksiyalar:**
- TOTP (Google Authenticator / Authy) qo'llab-quvvatlash
- SMS orqali OTP
- Email orqali OTP
- Backup (bir martalik) kodlar
- 2FA ni yoqish/o'chirish sozlamalarda
- Ishonchli qurilmalar ro'yxati

Batafsil: [features/security.md](./features/security.md)

---

## 8. Ma'lumotlarni Eksport / Import

**Nima:** Tizim ma'lumotlarini CSV, Excel yoki JSON formatida eksport/import qilish.

**Nima uchun kerak:**
- Hisobotlar uchun ma'lumotlarni Excel'ga eksport qilish biznes talab
- Ma'lumot ko'chirish (migratsiya) yoki zaxira nusxa (backup) uchun kerak
- Buxgalteriya va moliya hisobot shakllari uchun eksport zarur

**Qanday funksiyalar:**
- Jadvallarni CSV/Excel eksport (Foydalanuvchilar, Buyurtmalar, Mahsulotlar)
- Sana oralig'i va filtr bilan eksport
- Bulk import (CSV dan foydalanuvchi, mahsulot yuklash)
- Import xatolari va validatsiya hisoboti
- Eksport tarixi (kim, qachon eksport qilgan)

**Kutubxonalar:** `xlsx`, `papaparse`, `file-saver`

Batafsil: [features/export-import.md](./features/export-import.md)

---

## 9. Bulk Actions (Ommaviy Amallar)

**Nima:** Bir vaqtning o'zida bir nechta element tanlash va ularga bitta amal bajarish.

**Nima uchun kerak:**
- Ko'p foydalanuvchi/mahsulotni birdaniga o'chirish yoki holat o'zgartirish vaqt tejaydi
- Hozir har bir element alohida amal talab qiladi — bu samarasiz

**Qanday funksiyalar:**
- Jadval qatorlari yonida checkbox
- "Barchasini tanlash" toggle
- Tanlangan elementlar soni ko'rsatish
- Bulk delete, bulk activate/deactivate, bulk export
- Amaldan oldin tasdiqlash modal

---

## 10. Kengaytirilgan Qidiruv va Filtrlar

**Nima:** Har bir sahifada kuchli qidiruv va ko'p parametrli filtrlar.

**Nima uchun kerak:**
- Ma'lumotlar ko'paygan sari oddiy qidiruv yetarli emas
- Admin aniq parametrlar bo'yicha kerakli elementni topishi kerak

**Qanday funksiyalar:**
- Global qidiruv (barcha modullar bo'yicha)
- Sana oralig'i filtri (date range picker)
- Ko'p parametrli filtr (status + rol + sana bir vaqtda)
- Qidiruv tarixini saqlash
- Filtr presetlarini saqlash
- URL da filtr holati saqlash (sahifani yangilasa ham saqlanadi)

---

## 11. Profil Sahifasi (To'liq)

**Nima:** Admin o'z profilini ko'rish va tahrirlash sahifasi.

**Nima uchun kerak:**
- Hozir `/profile` sahifasi bo'sh placeholder
- Admin o'z ma'lumotlarini yangilashi, parolini o'zgartirishi kerak

**Qanday funksiyalar:**
- Profil rasmi yuklash va o'zgartirish
- Shaxsiy ma'lumotlar tahrirlash (ism, email, telefon)
- Parol o'zgartirish formi (eski parol tasdiqlanadi)
- Tizimga kirish tarixi
- Faol seanslar ro'yxati va ularni tugatish
- 2FA sozlamalari (yuqoridagi 7-punkt bilan bog'liq)
- Til va tema afzalliklari

---

## 12. Sozlamalar Sahifasi (To'liq)

**Nima:** Tizim darajasidagi global sozlamalar (faqat Super Admin).

**Nima uchun kerak:**
- Hozir `/settings` sahifasi placeholder
- Super Admin tizim parametrlarini kodga tegmasdan o'zgartira olishi kerak

**Qanday funksiyalar:**
- Sayt nomi, logotipi, kontakt ma'lumotlari
- Email server sozlamalari (SMTP)
- To'lov tizimi kalit sozlamalari
- Tizim texnik xizmat (maintenance mode)
- Ro'yxatga olish (registration) yoqish/o'chirish
- Ruxsat etilgan fayl turlari va o'lchamlari
- Tizim tilini belgilash (default language)

---

## 13. Email Shablonlari Boshqaruvi

**Nima:** Tizim tomonidan yuboriluvchi email xabarlar shablonlarini tahrirlash.

**Nima uchun kerak:**
- Xush kelibsiz email, parol tiklash, buyurtma tasdiqlaish kabi emaillar brend identifikatsiyasini saqlashi kerak
- Dasturchi yordamisiz email matnini o'zgartirish imkonini beradi

**Qanday funksiyalar:**
- Shablon ro'yxati (xabarnoma turi bo'yicha)
- WYSIWYG editor bilan shablon tahrirlash
- O'zgaruvchilar ro'yxati (`{{username}}`, `{{order_id}}`)
- Test email yuborish
- Versiya tarixi

---

## 14. API Kalitlar Boshqaruvi

**Nima:** Tashqi tizimlar bilan integratsiya uchun API kalitlarini boshqarish.

**Nima uchun kerak:**
- Mobil ilova yoki uchinchi tomon xizmatlar API orqali tizimga ulanishi mumkin
- API kalitlarni GUI orqali boshqarish xavfsizroq va qulayroq

**Qanday funksiyalar:**
- API kalit yaratish (nom, huquqlar, muddati)
- Kalitlarni ko'rish, nusxalash, o'chirish
- So'rovlar statistikasi (har bir kalit uchun)
- IP whitelist sozlash
- Kalit ruxsatlari (read-only, write, admin)

---

## 15. Tizim Salomatligi Monitori

**Nima:** Server va tizim komponentlarining real-time ishlash holatini ko'rsatish.

**Nima uchun kerak:**
- Admin tizimda muammo bo'lganini darhol bilishi kerak
- Xizmatlar ishlamay qolganda (API, DB, cache) ogohlantirilish kerak

**Qanday funksiyalar:**
- API server status (online/offline, response time)
- Ma'lumotlar bazasi ulanish holati
- Serverda xotira va CPU yuklanishi
- Uptime grafiki
- Xato jurnali (error log viewer)
- Telegram/Email orqali ogohlantirishlar (alerts)

---

## Ustuvorlik bo'yicha amalga oshirish tartibi

### 1-bosqich (Eng muhim — tezda qilish kerak)
1. Roles & Permissions Management (placeholder ni to'ldirish)
2. Mahsulotlar, Buyurtmalar, Mijozlar (placeholder ni to'ldirish)
3. Profil va Sozlamalar sahifalarini to'ldirish

### 2-bosqich (Muhim qo'shimchalar)
4. Analytics & Charts Dashboard
5. 2FA xavfsizlik
6. Ma'lumotlar Eksport/Import
7. Bulk Actions

### 3-bosqich (Kelajakdagi yaxshilanishlar)
8. Real-time Notifications (WebSocket)
9. Kengaytirilgan qidiruv
10. Email shablonlari
11. API kalitlar
12. Tizim monitoring
