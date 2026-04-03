# Savdo Admin Panel — Tavsiyalar va Yaxshilanishlar

> Hozirgi holat tahlili asosida yozilgan. Barcha tavsiyalar mavjud struktura va texnologiyalar (React 18, CSS variables, Context API) bilan mos keladi.

---

## 1. UX / UI Yaxshilanishlar

### 1.1 Dashboard

**Hozirgi holat:** Stat kartalar, faoliyat lenti, bildirishnomalar bor, lekin ma'lumotlar statik (mock).

**Qo'shish kerak:**
- [ ] **Grafik / Chart komponentlar** — Recharts yoki Chart.js bilan:
  - Haftalik foydalanuvchilar registratsiyasi (Line chart)
  - Kontent turi bo'yicha taqsimot (Pie chart)
  - Kunlik faoliyat (Bar chart)
- [ ] **Quick Actions panel** — Tez amal tugmalari (Yangi foydalanuvchi qo'sh, Kontent yaratish)
- [ ] **Real-time indikator** — Backend bilan ulanishda "live" yangilanish (WebSocket yoki polling)
- [ ] **Skeleton loading** — Ma'lumot yuklanayotganda bo'sh kartalar o'rniga skeleton UI
- [ ] **Shortcut keys** (keyboard shortcuts) — `Ctrl+K` → quick search, `Ctrl+N` → yangi yozuv
- [ ] **Widget sozlash** — Admin dashboard tartibini sudrab o'zgartira olsin (drag-and-drop)

---

### 1.2 Foydalanuvchilar (Users)

**Hozirgi holat:** To'liq CRUD bor, lekin qidiruv oddiy, sahifalash yo'q.

**Qo'shish kerak:**
- [ ] **Pagination (Sahifalash)** — Hozir barcha userlar bir jadvalda, 10/20/50 qator tanlov
- [ ] **Column sorting** — Har bir ustun bo'yicha sort (ismi, sana, roli bo'yicha)
- [ ] **Bulk actions** — Bir nechta foydalanuvchini tanlab, ommaviy bloklash / o'chirish
- [ ] **Avatar / profil rasm** — Foydalanuvchi avatari (initials yoki rasm)
- [ ] **Inline edit** — Jadval ichida to'g'ridan-to'g'ri tahrirlash (modal ochmasdan)
- [ ] **User activity history** — `/users/:id` sahifasida foydalanuvchi login tarixi, harakatlari
- [ ] **Export to CSV/Excel** — Foydalanuvchilar ro'yxatini yuklab olish
- [ ] **Advanced filter panel** — Filtr panelini kengaytirish (sana oraliq, oxirgi login, etc.)
- [ ] **User impersonation** — Super admin boshqa foydalanuvchi sifatida kirishi (debug uchun)

---

### 1.3 Adminlar (Admins)

**Hozirgi holat:** Create/Read/block bor, delete va edit cheklangan.

**Qo'shish kerak:**
- [ ] **Invite email** — Admin yaratilganda real email xabar yuborish (backend bilan)
- [ ] **Admin faoliyat ko'rsatkichi** — Har bir admin uchun qilgan amallar soni, oxirgi faollik
- [ ] **Permission visual tag** — Har bir adminda qaysi ruxsatlar borligini rangli badge bilan ko'rsatish
- [ ] **Audit trail link** — Admin kartasidan bevosita uning audit loglariga o'tish

---

### 1.4 Rollar va Ruxsatlar (Roles & Permissions)

**Hozirgi holat:** Role kartalar va permission matrix bor, edit/delete yo'q.

**Qo'shish kerak:**
- [ ] **Role tahrirlash va o'chirish** — Yaratilgan rollarni update/delete qilish
- [ ] **Permission template** — Tayyor shablonlar (read-only, editor, manager)
- [ ] **Permission diff view** — Rol ruxsatlari o'zgarganda "nima o'zgardi" ko'rsatish
- [ ] **Ruxsatnoma history** — Qachon kim qaysi permission o'zgartirganini ko'rsatish
- [ ] **Role assignment counter** — Har bir rolda nechta admin/user borligini live ko'rsatish

---

### 1.5 Audit Logs

**Hozirgi holat:** Ro'yxat bor, filter/qidiruv bor, export tugmasi ishlamaydi.

**Qo'shish kerak:**
- [ ] **Export to CSV** — Filtrlangan loglarni export qilish (backend endpoint bilan)
- [ ] **Detail modal** — Log yozuviga bosib to'liq ma'lumot ko'rish (IP, user agent, payload)
- [ ] **Severity level** — Logni darajasi: info, warning, critical (rangli belt bilan)
- [ ] **Chart overlay** — Audit loglar grafigi (vaqt bo'yicha faoliyat oshishi/kamayishi)
- [ ] **Auto-refresh** — Sahifa avtomatik yangilansin (har 30 sek)
- [ ] **IP geolocation** — IP manzilini mo'ljallangan joy bilan ko'rsatish (agar backend qo'llab-quvvatlasa)

---

### 1.6 Kontent Boshqaruvi (Content)

**Hozirgi holat:** CRUD bor, faqat status update ishlaydi, delete yo'q.

**Qo'shish kerak:**
- [ ] **Rich text editor** — Kontent tahrirlash uchun WYSIWYG editor (TipTap yoki Quill)
- [ ] **Media upload** — Rasm/video yuklash imkoniyati
- [ ] **Content preview** — "Ko'rish" tugmasi bilan kontent previewi
- [ ] **Version history** — Kontent versiyalari (qachon kim nima o'zgartirgan)
- [ ] **Scheduled publish** — Kelajakdagi sana/vaqtda avtomatik nashr
- [ ] **Delete funksiyasi** — Kontent o'chirish (softdelete bilan)
- [ ] **Tag/Category** — Kontent taqsimlash uchun teglar va kategoriyalar
- [ ] **SEO fields** — Meta title, description, slug maydonlari

---

### 1.7 Hisobotlar (Reports)

**Hozirgi holat:** UI tayyor, filter bor, export ishlamaydi.

**Qo'shish kerak:**
- [ ] **Interactive charts** — Hisobot ma'lumotlarini grafikda ko'rsatish
- [ ] **PDF export** — Hisobotni PDF formatida yuklab olish
- [ ] **Scheduled reports** — Kunlik/haftalik/oylik hisobot email orqali yuborish
- [ ] **Custom date range** — Foydalanuvchi o'zi sana oralig'ini belgilashi
- [ ] **Comparison view** — Ikki davr oralig'ini solishtirish (bu oy vs o'tgan oy)
- [ ] **KPI cards** — Asosiy ko'rsatkichlar (MAU, DAU, conversion rate)

---

### 1.8 Sozlamalar (Settings)

**Hozirgi holat:** Faqat birinchi tab (Profile) ishlaydi, qolganlar placeholder.

**Qo'shish kerak:**
- [ ] **Notification Settings tab** — Email/push bildirishnoma sozlamalari
- [ ] **Security Settings tab** — Parolni o'zgartirish, 2FA yoqish/o'chirish
- [ ] **System Settings tab** — Feature flags, session timeout, email konfiguratsiyasi
- [ ] **Theme Settings** — Dark/Light mode (CSS variables orqali oson qo'shiladi)
- [ ] **Appearance** — Sidebar rangi, accent color tanlash
- [ ] **API Keys panel** — Integratsiyalar uchun API key boshqaruvi
- [ ] **Webhook settings** — Tashqi tizimlar uchun webhook URL konfiguratsiyasi

---

### 1.9 Profil (Profile)

**Hozirgi holat:** Ko'rish rejimi bor, tahrirlash yo'q.

**Qo'shish kerak:**
- [ ] **Profil tahrirlash** — Ism, email, telefon o'zgartirish
- [ ] **Avatar yuklash** — Profil rasmi yuklash
- [ ] **Parol o'zgartirish** — Joriy parol + yangi parol forma
- [ ] **2FA sozlash** — QR code orqali authenticator app ulash
- [ ] **Active sessions** — Qaysi qurilmalardan kirganligini ko'rish va ularni tugatish
- [ ] **My audit log** — Faqat o'z harakatlarini ko'rsatish

---

## 2. Yangi Sahifalar va Modullar

### 2.1 Buyurtmalar (Orders) — `/orders`
> Hozir placeholder mavjud, to'ldirish kerak

- [ ] Buyurtmalar ro'yxati (jadval)
- [ ] Status: pending, processing, shipped, delivered, cancelled
- [ ] Buyurtma detail sahifasi (`/orders/:id`)
- [ ] Status o'zgartirish workflow (Kanban yoki dropdown)
- [ ] Filter: sana, status, mijoz, summa
- [ ] Export to CSV

---

### 2.2 Mijozlar (Customers) — `/customers`
> Hozir placeholder mavjud, to'ldirish kerak

- [ ] Mijozlar ro'yxati + qidiruv
- [ ] Mijoz detail: buyurtmalar tarixi, jami summa, oxirgi faollik
- [ ] Segment: VIP, regular, yangi, faolsiz
- [ ] Mijoz eksport

---

### 2.3 Mahsulotlar (Products) — `/products`
> Hozir route ham yo'q

- [ ] Mahsulot ro'yxati (jadval + grid ko'rinish)
- [ ] CRUD: yaratish, tahrirlash, o'chirish
- [ ] Kategoriya boshqaruvi
- [ ] Rasm yuklash
- [ ] Narx va zaxira boshqaruvi (inventory)
- [ ] Mahsulot import (Excel/CSV)
- [ ] Variant boshqaruvi (rang, o'lcham)

---

### 2.4 Analitika (Analytics) — `/analytics`
> Yangi modul

- [ ] Traffic overview (sessiyalar, foydalanuvchilar)
- [ ] Konversiya funnel
- [ ] Mahsulot top sellerlari
- [ ] Mijoz geographiyasi (xarita)
- [ ] Revenue analytics (daromad grafigi)

---

### 2.5 Bildirishnomalar (Notifications) — `/notifications`
> Yangi modul

- [ ] Bildirishnoma yuborish (push/email/SMS)
- [ ] Segment bo'yicha yuborish (barcha, VIP, yangi)
- [ ] Shablon yaratish
- [ ] Yuborish tarixi va statistikasi (yuborildi, o'qildi, bosdi)

---

### 2.6 To'lovlar (Payments) — `/payments`
> Yangi modul (e-commerce uchun zarur)

- [ ] To'lov tranzaksiyalari ro'yxati
- [ ] Qaytarishlar (refund) boshqaruvi
- [ ] To'lov holati: success, failed, pending, refunded
- [ ] Payment gateway konfiguratsiyasi

---

### 2.7 Support / Tickets — `/support`
> Yangi modul

- [ ] Mijoz murojaat ro'yxati
- [ ] Status: open, in_progress, resolved, closed
- [ ] Chat-style javob berish
- [ ] Prioritet: low, medium, high, urgent
- [ ] SLA tracker

---

## 3. Texnik Yaxshilanishlar (Frontend)

### 3.1 Backend Integratsiya
- [ ] **API real integratsiya** — Axios client interceptorlar bilan JWT token qo'shish
- [ ] **Token refresh** — Access token muddati tugaganda refresh token bilan yangilash
- [ ] **Error handling** — Axios response interceptor bilan global xato boshqaruvi
- [ ] **Loading states** — Har bir API chaqiruvda loading spinner
- [ ] **Optimistic updates** — UI darhol yangilansın, API muvaffaqiyatsiz bo'lsa rollback

### 3.2 Performance
- [ ] **React.lazy + Suspense** — Sahifalarni lazy load qilish (bundle size kamaytirish)
- [ ] **Virtual list** — Ko'p qatorli jadvallar uchun virtualizatsiya (react-window)
- [ ] **Debounce** — Qidiruv maydonida debounce (hozir har harfda qayta render)
- [ ] **Memoization** — `useMemo`, `useCallback` og'ir hisob-kitoblarda

### 3.3 Holat Boshqaruvi
- [ ] **Zustand yoki TanStack Query** — Context API ni almashtirish (katta loyiha uchun)
- [ ] **Server state bilan client state ajratish** — React Query bilan API data caching
- [ ] **Persist middleware** — localStorage persistence avtomatik boshqarish

### 3.4 Form Boshqaruvi
- [ ] **React Hook Form** — Forma validatsiyasi va boshqaruvini yaxshilash
- [ ] **Zod schema validation** — Type-safe validatsiya sxemalari
- [ ] **Field-level validation** — Har bir maydonda real-time validatsiya xabarlari

### 3.5 Test
- [ ] **Unit tests** — Vitest bilan komponent testlari
- [ ] **E2E tests** — Playwright yoki Cypress bilan login + CRUD testlari
- [ ] **Accessibility tests** — axe-core bilan a11y tekshiruvi

---

## 4. UX Prinsiplari — Umumiy

### 4.1 Dark Mode
CSS variables orqali oson qo'shish mumkin:
```css
[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --text: #f1f5f9;
}
```
- [ ] Header yoki Settings da toggle tugmasi
- [ ] `localStorage` da saqlansin
- [ ] Tizim (OS) tematig'ini auto-detect qilsin

---

### 4.2 Keyboard Navigation
- [ ] `Tab` orqali to'liq navigatsiya
- [ ] `Enter`/`Space` modal ochish/yopish
- [ ] `Escape` modalni yopish (hozir bor, boshqa joylarda ham kerak)
- [ ] Focus trap modal ichida

---

### 4.3 Empty States
Hozir ba'zi joylarda mavjud, barchaga qo'shish:
- [ ] Har bir jadval/ro'yxatda chiroyli empty state (rasm + matn + CTA tugma)
- [ ] `No results found` emas, `Hali hech narsa qo'shilmagan. Birinchi qo'shish uchun tugmani bosing.` kabi

---

### 4.4 Mobile Responsive
- [ ] Sidebar hozir mobile toggle bor, lekin jadvallar mobile uchun optimallashtirilmagan
- [ ] Jadvallar mobile da horizontal scroll yoki card ko'rinishiga o'tsin
- [ ] Touch-friendly tugma o'lchamlari (min 44px)

---

### 4.5 Accessibility (a11y)
- [ ] `aria-label` barcha ikonli tugmalarga
- [ ] `role="alert"` toast notificationlarda
- [ ] Kontrast tekshiruvi (WCAG AA minimal)
- [ ] Skip to main content link

---

### 4.6 Error States
- [ ] 500 Server error sahifasi
- [ ] Network error banner (internet yo'q holda)
- [ ] Form submit xato bo'lganda aniq xabar

---

## 5. Xavfsizlik Yaxshilanishlari

- [ ] **Real JWT** — Demo tokenlarni haqiqiy JWT bilan almashtirish
- [ ] **Token expiry** — Access token 15 daqiqa, refresh token 7 kun
- [ ] **CSRF protection** — API so'rovlarida CSRF token
- [ ] **Rate limiting** — Login sahifasida brute-force himoya (backend)
- [ ] **Session management** — Parallel sessiyalarni boshqarish
- [ ] **2FA (TOTP)** — Google Authenticator / Authy qo'llab-quvvatlash
- [ ] **IP whitelist** — Super admin uchun IP cheklash imkoniyati
- [ ] **XSS prevention** — Foydalanuvchi kiritgan ma'lumotlarni sanitize qilish
- [ ] **Sensitive data masking** — Jadvalda email/phone qisman yashirish

---

## 6. Backend Tavsiyalar

### 6.1 API Endpointlar (Kerakli)
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/users          ?page&limit&search&role&status
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/status

GET    /api/admins
POST   /api/admins
PUT    /api/admins/:id
PATCH  /api/admins/:id/status

GET    /api/roles
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id

GET    /api/permissions
PUT    /api/permissions

GET    /api/content        ?page&type&status
POST   /api/content
PUT    /api/content/:id
DELETE /api/content/:id

GET    /api/audit-logs     ?page&category&from&to
GET    /api/audit-logs/export

GET    /api/reports/overview
GET    /api/reports/admin-activity
GET    /api/reports/security
GET    /api/reports/export

GET    /api/products
POST   /api/products
...

GET    /api/orders
...
```

### 6.2 Backend Infratuzilma
- [ ] **Pagination** — Barcha ro'yxat endpointlarda `page`, `limit`, `total` qaytarish
- [ ] **Rate limiting** — `express-rate-limit` bilan
- [ ] **Input validation** — `joi` yoki `zod` bilan
- [ ] **File upload** — Multer + Cloudinary / S3
- [ ] **WebSocket** — Real-time bildirishnomalar uchun (Socket.io)
- [ ] **Email service** — Nodemailer + SMTP yoki SendGrid
- [ ] **Caching** — Redis bilan tez-tez so'raladigan ma'lumotlarni cache

---

## 7. Kelajakdagi Katta Modullar (Roadmap)

| Modul | Muhimlik | Murakkablik |
|-------|----------|-------------|
| Mahsulotlar (Products) | Yuqori | O'rta |
| Buyurtmalar (Orders) | Yuqori | O'rta |
| Mijozlar (Customers) | Yuqori | Kam |
| Analitika (Analytics) | O'rta | Yuqori |
| Bildirishnomalar (Push/Email) | O'rta | O'rta |
| To'lovlar (Payments) | Yuqori | Yuqori |
| Support Tickets | O'rta | O'rta |
| Inventar / Ombor | O'rta | Yuqori |
| Dark Mode | Kam | Kam |
| Mobile App Admin Panel | Yuqori | Yuqori |

---

## 8. Tezkor Yaxshilanishlar (Quick Wins)

Bir-ikki soatda bajariladigan narsalar:

1. **Pagination** — Users va Content jadvallariga (30 daqiqa)
2. **Column sorting** — Jadval sarlavhalariga sort (1 soat)
3. **Dark mode** — CSS variables orqali (2 soat)
4. **Skeleton loading** — Ma'lumot yuklanayotganda (1 soat)
5. **Delete funksiyasi** — Content va Roles uchun (30 daqiqa)
6. **Export CSV** — Foydalanuvchilar ro'yxatini yuklab olish (1 soat)
7. **User Detail page** — `/users/:id` sahifasini to'ldirish (2 soat)
8. **Settings tablar** — Notification va Security tablarini faollashtirish (3 soat)

---

## 9. Dizayn Tavsiyalar

### Komponent kutubxonasi qo'shish haqida
Hozir sof CSS ishlatiladi. Quyidagilarni qo'shish mumkin:

| Variant | Afzalliklari | Kamchiliklari |
|---------|-------------|---------------|
| **Shadcn/ui** | Headless, o'z dizayngacha mos | Setup kerak |
| **Radix UI** | Accessible, headless | Styling qo'lda |
| **Mantine** | To'liq komponentlar | CSS override qiyin |
| **Sof CSS saqla** | Eng moslashuvchan | Ko'p yozish kerak |

**Tavsiya:** Hozirgi sof CSS saqlansin, faqat `Radix UI` primitives (Dialog, Select, Tooltip) qo'shilsin — accessibility uchun.

---

*Yozilgan sana: 2026-03-30*
*Loyiha: Savdo-E Admin Panel*
*Texnologiya: React 18 + Vite + CSS + Context API + MongoDB*
