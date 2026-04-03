# Savdo-E — Deploy Qilish Yo'riqnomasi

Loyihaning uchta qismini (Backend, Web, Admin Panel) production muhitiga deploy qilish bo'yicha to'liq qo'llanma.

---

## 1. Backend Deploy (Railway / Render)

### Railway orqali (Tavsiya)

```bash
# Railway CLI o'rnating
npm install -g @railway/cli

# Loyihaga kiring
railway login

# Yangi loyiha yarating
railway init

# Deploy qiling
cd backend
railway up
```

**Muhit o'zgaruvchilari (Railway dashboard'da belgilang):**
```env
PORT=5002
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/savdo_db
JWT_ACCESS_SECRET=min_32_characters_random_string
JWT_REFRESH_SECRET=min_32_characters_random_string
GEMINI_API_KEY=AIzaSy...
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CORS_ORIGIN=https://savdo-e.vercel.app,https://admin.savdo-e.vercel.app
```

### Render orqali

1. [render.com](https://render.com) ga kiring
2. **New Web Service** → GitHub repo tanlang
3. **Root Directory:** `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Environment variables qo'shing
7. **Create Web Service** tugmasini bosing

---

## 2. Web Frontend Deploy (Vercel)

```bash
cd web
npm run build

# Vercel CLI orqali
npx vercel deploy --prod
```

Yoki GitHub orqali avtomatik deploy:
1. Vercel.com → **New Project** → GitHub repo
2. **Root Directory:** `web`
3. **Framework:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

**Environment Variables:**
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
```

---

## 3. Admin Panel Deploy (Vercel)

```bash
cd web/admin
npm run build

npx vercel deploy --prod
```

Yoki Vercel dashboard orqali:
1. **New Project** → GitHub repo
2. **Root Directory:** `web/admin`
3. **Framework:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

**`web/admin/vercel.json`** (SPA routing uchun):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Environment Variables:**
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_APP_NAME=Savdo Admin
```

---

## 4. MongoDB Atlas Sozlash

1. [mongodb.com/atlas](https://www.mongodb.com/atlas) ga kiring
2. **Create a Cluster** → Free tier (M0)
3. **Database Access** → Yangi foydalanuvchi yarating
4. **Network Access** → `0.0.0.0/0` (barcha IP)
5. **Connect** → Driver: Node.js → Connection string oling

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/savdo_db?retryWrites=true&w=majority
```

---

## 5. Production Tekshiruvi (Checklist)

### Backend
- [ ] `NODE_ENV=production` belgilangan
- [ ] JWT secretlari 32+ belgili
- [ ] CORS faqat kerakli domainlarga ruxsat beradi
- [ ] Rate limiting yoqilgan
- [ ] MongoDB Atlas ulanishi ishlaydi
- [ ] `/health` endpoint `200 OK` qaytaradi

### Frontend / Admin
- [ ] `VITE_API_URL` production backend URL ga ko'rsatilgan
- [ ] Build muvaffaqiyatli yakunlangan
- [ ] Login ishlaydi
- [ ] API chaqiruvlari ishlaydi

### Xavfsizlik
- [ ] HTTPS yoqilgan (Vercel/Railway avtomatik)
- [ ] Parollar bcrypt bilan hashlangan
- [ ] JWT tokenlar muddati belgilangan
- [ ] Muhim ma'lumotlar `.env` da (GitHub'ga yuklanmagan)

---

## 6. Domen Ulash

### Vercel'da custom domen
1. Vercel Project → **Settings** → **Domains**
2. Domeningizni kiriting: `admin.savdo-e.uz`
3. DNS provider'da CNAME yozing:
   ```
   CNAME  admin  cname.vercel-dns.com
   ```

### Backend uchun (Railway)
1. Railway → Project → **Settings** → **Domains**
2. Custom domen qo'shing: `api.savdo-e.uz`

---

## Monitoring va Loglar

| Xizmat | Maqsad | Bepul |
|--------|--------|-------|
| Vercel Analytics | Frontend traffic | ✅ |
| Railway Logs | Backend loglar | ✅ |
| MongoDB Atlas | DB monitoring | ✅ |
| Sentry | Error tracking | ✅ (5K/oy) |
| UptimeRobot | Uptime monitoring | ✅ |

---

*Yozilgan sana: 2026-04-03*  
*Loyiha: Savdo-E*
