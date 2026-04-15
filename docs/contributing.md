# Savdo-E — Hissa Qo'shish Yo'riqnomasi

Loyihaga hissa qo'shishdan oldin ushbu qo'llanmani o'qib chiqing.

---

## Loyiha Tuzilishi

```
Savdo-E/
├── backend/        # Node.js + Express + MongoDB
├── web/            # React 18 (asosiy web platforma)
│   └── admin/      # React 18 (admin panel)
├── mobile/         # React Native + Expo
└── docs/           # Hujjatlar
```

---

## Ishni Boshlash

### 1. Reponi fork qiling va clone qiling
```bash
git clone https://github.com/your-username/savdo-e.git
cd savdo-e
```

### 2. Branch yarating
```bash
git checkout -b feature/yangi-funksiya
# yoki
git checkout -b fix/xato-tuzatish
```

Branch nomlash qoidasi:
- `feature/` — yangi funksiya
- `fix/` — xato tuzatish
- `docs/` — hujjat yangilash
- `refactor/` — kod qayta tuzish

### 3. O'zgarishlarni qiling va commit qiling
```bash
git add .
git commit -m "feat: yangi funksiya qo'shildi"
```

**Commit xabar formati:**
```
<tur>: <qisqa tavsif>

tur:
  feat     - yangi funksiya
  fix      - xato tuzatish
  docs     - hujjat
  style    - formatlash
  refactor - kod qayta tuzish
  test     - test qo'shish
  chore    - konfiguratsiya
```

### 4. Pull Request oching
```bash
git push origin feature/yangi-funksiya
```
GitHub'da PR oching va quyidagilarni kiriting:
- Nima o'zgardi
- Nima uchun o'zgardi
- Qanday test qilindi

---

## Kod Uslubi

### JavaScript / React
- `const` va `let` ishlating, `var` emas
- Arrow functions ishlating
- Komponent nomlari: `PascalCase`
- Funksiya nomlari: `camelCase`
- O'zgaruvchi nomlari: `camelCase`
- Fayllar: `ComponentName.jsx`, `utilName.js`

### CSS / Tailwind
- Tailwind classlarini ishlating
- CSS fayllarida BEM metodologiyasi
- Global styles faqat `theme/index.jsx` da

### API / Backend
- RESTful konvensiyalarga amal qiling
- Barcha endpointlarda `ApiResponse` wrapper ishlating
- Xatolarni `ApiError` orqali throw qiling
- `asyncHandler` wrapperni ishlating

---

## Test Qilish

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd web
npm test
```

### Admin Panel
```bash
cd web/admin
npm test
```

**Testdan oldin tekshiring:**
- [ ] Login ishlaydi
- [ ] CRUD operatsiyalar ishlaydi
- [ ] Xato holatlari to'g'ri ko'rsatiladi
- [ ] Muhim fayllar `.env` da (git'ga yuklanmaydi)

---

## Muhim Qoidalar

1. **Hech qachon `main` branchga to'g'ridan-to'g'ri push qilmang**
2. **`.env` fayllarni commit qilmang** — `example.env` fayldan foydalaning
3. **API secretlarini kod ichida yozmang**
4. **Har bir PR kamida bitta reviewerdan o'tishi kerak**
5. **Testlar o'tishi kerak** — CI/CD bloklaydi

---

## Muammoni Xabar Qilish (Bug Report)

GitHub Issues'da yangi issue oching va quyidagilarni kiriting:

```
**Muamlo tavsifi:**
[Nima sodir bo'ldi]

**Qadam-badam ko'rsatma:**
1. ...
2. ...
3. ...

**Kutilgan natija:**
[Nima bo'lishi kerak edi]

**Haqiqiy natija:**
[Nima bo'ldi]

**Muhit:**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox
- Node.js versiyasi:
```

---

*Savdo-E jamoasi bilan ishlashdan xursandmiz!*
