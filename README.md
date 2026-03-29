# 🛒 Savdo-E | Modern E-Commerce Platform with AI 🚀

Savdo-E is a high-performance, production-ready e-commerce solution built with a modern tech stack. It features a robust Node.js backend, a beautiful React web dashboard, and a React Native mobile application.

---

## 🌟 Key Features

### 🌍 Full Localization (i18n)
- **Languages**: Full support for Uzbek (UZ), Russian (RU), and English (EN).
- **Dynamic Formatting**: Automatic localization of currency, dates, and number formats.
- **Unified Switcher**: Seamless language switching across all dashboard components.

### 🤖 Intelligent AI Assistant (Gemini)
- **Brain**: Powered by Google Gemini 1.5 Flash.
- **Context-Aware**: Knows your inventory, stock levels, and sales trends to give 100% accurate answers.
- **Capabilities**: Suggests products, provides business advice (profit/stock tips), and handles general inquiries in multiple languages.

### 📊 Business Management
- **Sales Tracking**: Real-time sales recording with daily/monthly report summaries.
- **Product Management**: Full CRUD with categorized inventory, stock control, and unit management.
- **Reports**: Advanced statistics including revenue, profit, and top-selling products.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js 18+, Express 4, MongoDB (Mongoose), Google Generative AI |
| **Frontend** | React 18, Vite, i18next, TanStack Query, Tailwind CSS |
| **Mobile** | React Native, Expo, React Navigation |
| **Auth** | JWT Access + Refresh Token rotation, Fingerprinting |
| **Security** | Helmet, CORS, Rate Limiting, Input Validation (Joi), Mongo Sanitize |

---

## 📁 System Architecture

The project follows a modular **MVC (Model-View-Controller) + Service Layer** pattern for maximum scalability and maintainability.

### 🏗 Backend Structure
- `src/models`: Database schemas for Products, Sales, Users, Orders, etc.
- `src/services`: Core business logic (isolated from the transport layer).
- `src/controllers`: Request/Response handling.
- `src/routes`: API endpoint definitions (V1).
- `src/middlewares`: Auth (JWT/RBAC), Error handling, and validation.

### ⚛️ Frontend structure
- `src/api`: Centralized axios instance with auth interceptors.
- `src/components`: Reusable atomized UI components (AI Assistant, Layout, Modals).
- `src/pages`: Feature-rich page compositions (Dashboard, Sales, Products, Reports).
- `src/i18n.js`: Centralized multilingual resource repository.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is set up with MONGO_URI and GEMINI_API_KEY
npm run dev
# → Default Port: 5002
```

### 2. Web Frontend Setup
```bash
cd web
npm install
npm run dev
# → Default Port: 5173
```

---

## 🔒 Security Measures
- **Rate Limiting**: Protects against brute-force attacks.
- **Security Headers**: Using Helmet.js to prevent common injections.
- **Data Sanitization**: Against NoSQL injection and XSS.
- **JWT Rotation**: Secure authentication lifecycle management.

---

## 📝 Authors & Project Status
Developed as a high-quality, localized e-commerce solution.
**Status**: Stable Release (Localization & AI Integrated)

---

## 📄 License
MIT
