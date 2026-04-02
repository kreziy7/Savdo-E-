# Xavfsizlik — 2FA va Monitoring

## Maqsad

Admin panelni ruxsatsiz kirishdan himoya qilish va tizim faoliyatini real vaqtda kuzatish.

## Nima uchun kerak?

Admin panel eng ko'p nishonga olinadigan tizimlardan biri:

- **Bitta parol yetarli emas** — parol o'g'irlansa, hamma ma'lumot ochiladi
- **Katta zarar xavfi** — admin huquqlari bilan tizimni to'liq buzish mumkin
- **Qonuniy talablar** — GDPR, ISO 27001 standartlari 2FA talab qilishi mumkin

---

## 1. Ikki Bosqichli Autentifikatsiya (2FA)

### Qo'llab-quvvatlanadigan usullar

**TOTP (Authenticator ilovalar)**
- Google Authenticator, Authy, Microsoft Authenticator
- Har 30 soniyada yangi 6 raqamli kod
- Internet kerak emas

**SMS OTP**
- Telefon raqamiga 6 raqamli kod
- Eskpayri: 5 daqiqa

**Email OTP**
- Email manziliga kod yuborish
- Zaxira variant sifatida

**Backup kodlar**
- 10 ta bir martalik zaxira kod
- 2FA qurilmasini yo'qotganda ishlatiladi

### Foydalanuvchi oqimi

```
Login sahifasi
    ↓
Email + Parol to'g'ri ✓
    ↓
[2FA yoqilganmi?]
    ├── Ha → 2FA kod kiritish sahifasi
    │           ↓
    │       Kod to'g'ri ✓
    │           ↓
    │       Dashboard
    │
    └── Yo'q → Dashboard (to'g'ridan-to'g'ri)
```

### 2FA sozlash oqimi (profil sahifasida)

```
1. "2FA yoqish" tugmasini bosish
2. QR kodni Authenticator ilovada skanerlash
3. Ilovadan olingan 6 raqamli kodni kiritib tasdiqlash
4. Backup kodlarni ko'chirish/saqlash
5. 2FA faol ✓
```

### UI komponentlari

```
src/
  pages/
    auth/
      TwoFactorPage.jsx          (yangi — 2FA kod kiritish)
    profile/
      components/
        TwoFactorSetup.jsx       (yangi — QR va yoqish)
        BackupCodesModal.jsx     (yangi)
  services/
    api/
      twoFactor.api.js           (yangi)
```

### Backend talablari

```
POST /api/auth/2fa/setup        — QR URI generatsiya
POST /api/auth/2fa/verify       — Kodni tekshirish va yoqish
POST /api/auth/2fa/disable      — O'chirish (parol talab)
POST /api/auth/2fa/backup       — Backup kodlarni yangilash
POST /api/auth/login/2fa        — Login paytida kod tekshirish
```

---

## 2. Sessiya Boshqaruvi

### Faol seanslar ro'yxati

Profil sahifasida admin o'z aktiv seanslarini ko'rishi va yopishi mumkin:

```
┌─────────────────────────────────────────────────────┐
│  Faol seanslar                                      │
│  ─────────────────────────────────────────────────  │
│  💻 Windows 11, Chrome   Toshkent  📍 Hozirgi      │
│  📱 Android, Chrome      Toshkent  2 soat oldin [✕] │
│  💻 MacOS, Safari        Samarqand 1 kun oldin  [✕] │
│                        [Barchasini yopish]          │
└─────────────────────────────────────────────────────┘
```

**Xususiyatlar:**
- Qurilma, brauzer, joylashuv (IP asosida)
- Oxirgi faollik vaqti
- Hozirgi seans belgisi
- Alohida seans yopish
- Barchasini yopish (joriy seans saqlanadi)

---

## 3. Login Tarixi va Xavfsizlik Jurnali

### Login tarixi

```
Sana/Vaqt          IP manzil      Joylashuv    Natija
─────────────────────────────────────────────────────
01.04.2024 09:15   192.168.1.1    Toshkent     ✅ Kirdi
31.03.2024 18:30   10.0.0.5       Samarqand    ✅ Kirdi
30.03.2024 03:12   185.44.21.xx   Moskva       ❌ Rad etildi
```

**Nima uchun muhim:**
- Noma'lum joylashuvdan kirish urinishini aniqlash
- Qo'pol kuch (brute force) hujumini aniqlash
- Shubhali faoliyat haqida email ogohlantirishlar

### Xavfsizlik sozlamalari

- Sessiya muddati (30 daqiqa / 1 soat / 8 soat / 30 kun)
- IP bo'yicha kirish cheklash (whitelist)
- Noto'g'ri parollar soni chegarasi (5 urinishdan keyin vaqtinchalik blok)
- Yangi qurilmadan kirish bildirishnomasi

---

## 4. Tizim Salomatligi Monitori

### Dashboard widget

```
┌─────────────────────────────────────┐
│  Tizim holati                       │
│  API Server      ● Online   45ms   │
│  Ma'lumot bazasi ● Online   12ms   │
│  Cache (Redis)   ● Online    3ms   │
│  Fayl xizmati    ⚠ Sekin   320ms  │
└─────────────────────────────────────┘
```

### To'liq monitoring sahifasi `/settings/system`

**Server ko'rsatkichlari:**
- CPU yuklanish grafigi (oxirgi 24 soat)
- RAM ishlatilishi
- Disk hajmi

**API statistikasi:**
- So'rovlar soni (sekundiga)
- O'rtacha javob vaqti
- Xato darajasi (%)

**Xato jurnali (Error Logs):**
```
[2024-04-01 09:12:34] ERROR  Payment gateway timeout — OrderID: 1234
[2024-04-01 08:55:12] WARN   Low disk space (15% remaining)
[2024-04-01 07:30:01] INFO   Daily backup completed
```

**Ogohlantirishlar (Alerts):**
- Telegram bot orqali ogohlantirishlar
- Email ogohlantirishlar
- Ogohlantirish chegaralari sozlash (CPU > 80%, RAM > 90%)

---

## Amalga oshirish vaqti (taxminiy)

| Qism | Vaqt |
|------|------|
| 2FA TOTP (QR + tekshirish) | 8 soat |
| 2FA SMS/Email | 4 soat |
| Backup kodlar | 3 soat |
| Sessiya boshqaruvi | 5 soat |
| Login tarixi | 4 soat |
| Tizim monitori | 8 soat |
| **Jami** | **~32 soat** |

## Ustuvorlik: Yuqori

2FA admin panelning xavfsizligi uchun zarur. Tizim monitoring esa ishlab chiqarish (production) muhitida muammolarni tezda aniqlash uchun muhim.
