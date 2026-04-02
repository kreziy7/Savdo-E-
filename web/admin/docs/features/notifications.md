# Real-time Notification Center

## Maqsad

Admin muhim tizim hodisalaridan darhol xabar topishi uchun real vaqt rejimida ishluvchi bildirishnoma tizimini qurish.

## Nima uchun kerak?

Hozir admin muhim voqealarni bilish uchun sahifani yangilashi yoki o'zi tekshirishi kerak. Bu:

- **Kechikishga olib keladi** — yangi buyurtma kelganini bir necha soatdan keyin bilishi mumkin
- **Muhim xatolar o'tkazib yuboriladi** — tizim xatosi, to'lov muvaffaqiyatsizligi bildirimsiz qoladi
- **Samaradorlik pasayadi** — admin doim tekshirib turishi kerak bo'ladi

## Bildirishnoma turlari

| Tur | Misol | Muhimlik |
|-----|-------|----------|
| Yangi buyurtma | "Abdulloh 3 ta mahsulot buyurtma qildi" | Yuqori |
| To'lov muammosi | "INV-2847 to'lov muvaffaqiyatsiz" | Yuqori |
| Yangi foydalanuvchi | "Malika Yusupova ro'yxatga oldi" | O'rta |
| Zaxira tugadi | "iPhone 15 Pro — 2 ta qoldi" | O'rta |
| Tizim xatosi | "Ma'lumotlar bazasiga ulanishda muammo" | Kritik |
| Admin harakati | "Admin Otabek 15 foydalanuvchini o'chirdi" | O'rta |
| Hisobot tayyor | "Oylik hisobot eksport qilindi" | Past |

## UI Komponentlari

### Header qo'ng'iroq belgisi
```
[🔔 5]  — raqam o'qilmagan bildirishnomalar soni

Bosganida:
┌─────────────────────────────┐
│  Bildirishnomalar      ✕    │
│  ─────────────────────────  │
│  🔴 Yangi buyurtma  2 daqiqa│
│     #ORD-1234 — 150,000 so'm│
│  ─────────────────────────  │
│  🟡 Zaxira tugayapti  1 soat│
│     iPhone 15 — 2 dona qoldi│
│  ─────────────────────────  │
│  [Barchasini ko'rish]       │
└─────────────────────────────┘
```

### To'liq bildirishnomalar sahifasi `/notifications`
- Filtrlash: turi, holati (o'qilgan/o'qilmagan), sana
- Barchasini o'qilgan deb belgilash
- O'chirish
- Bildirishnomaga mos sahifaga o'tish (buyurtmani bosib → buyurtma sahifasi)

## Texnik amalga oshirish

### Variant 1: WebSocket (Real-time)
```javascript
// Eng yaxshi variant — haqiqiy real-time
import { io } from 'socket.io-client'

const socket = io(API_URL, { auth: { token } })
socket.on('notification', (data) => {
  addNotification(data)
  showToast(data)
})
```

### Variant 2: Server-Sent Events (SSE)
```javascript
// Sodda, bir tomonlama — server → client
const eventSource = new EventSource(`${API_URL}/events?token=${token}`)
eventSource.onmessage = (e) => addNotification(JSON.parse(e.data))
```

### Variant 3: Polling (Vaqtincha yechim)
```javascript
// Hozirgi arxitekturaga oson qo'shiladi
useEffect(() => {
  const interval = setInterval(() => fetchNewNotifications(), 30000)
  return () => clearInterval(interval)
}, [])
```

### Komponent strukturasi

```
src/
  components/
    notifications/
      NotificationBell.jsx       (yangi — Header'ga qo'shiladi)
      NotificationDropdown.jsx   (yangi)
      NotificationItem.jsx       (yangi)
  pages/
    notifications/
      NotificationsPage.jsx      (yangi)
  services/
    api/
      notifications.api.js       (yangi)
  hooks/
    useNotifications.js          (yangi)
```

### Brauzer Push Notification

```javascript
// Foydalanuvchi ruxsat berganida brauzer notification
if (Notification.permission === 'granted') {
  new Notification('Yangi buyurtma!', {
    body: 'Abdulloh 150,000 so\'mlik buyurtma qildi',
    icon: '/logo.png'
  })
}
```

## Backend talablari

```
GET    /api/notifications?page=1&unread=true
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
WS     /ws/notifications  (WebSocket endpoint)
```

## Amalga oshirish vaqti (taxminiy)

| Bosqich | Vaqt |
|---------|------|
| Polling asosida bildirishnomalar | 4 soat |
| UI komponentlari (Bell, Dropdown) | 4 soat |
| To'liq sahifa | 3 soat |
| WebSocket integratsiyasi | 4 soat |
| Push notification | 2 soat |
| **Jami** | **~17 soat** |

## Ustuvorlik: Yuqori

Savdo platformasida buyurtmalar real vaqtda kuzatilishi kerak, shuning uchun bu funksiya tez amalga oshirilishi tavsiya etiladi.
