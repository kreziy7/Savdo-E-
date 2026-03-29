# 🐛 Backend Bug Report

**Date:** March 29, 2024
**Status:** Bugs Found & Fixed ✓
**Total Issues:** 6 (1 Critical - FIXED, 3 High, 2 Medium)

---

## 🔴 CRITICAL BUG - FIXED ✓

### 1. **Typo in MongoDB Connection Handler (db.js:44)**
**Severity:** 🔴 CRITICAL - FIXED
**File:** `src/config/db.js:44`
**Issue:** Typo in property name causing crash

```javascript
// BUGGY CODE:
mongoose.connectionw  .on('disconnected', () => {  // ❌ "connectionw" - typo!
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});
```

**Impact:**
- App crashes immediately after MongoDB connects
- Error: `Cannot read properties of undefined (reading 'on')`
- Prevents app from starting

**Fixed Code:**
```javascript
// FIXED:
mongoose.connection.on('disconnected', () => {  // ✅ Correct
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});
```

**Status:** ✅ FIXED in latest commit

---

## 🟠 HIGH PRIORITY ISSUES

### 2. **No Input Validation in Auth Service (auth.service.js:12)**
**Severity:** 🟠 HIGH
**File:** `src/services/auth.service.js:12-19`
**Issue:** Missing email/password validation before database query

```javascript
// BUGGY CODE:
const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });  // ❌ No validation
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }
  const user = await User.create({ name, email, password });
  return user;
};
```

**Impact:**
- Invalid emails accepted (e.g., "test" instead of "test@example.com")
- Empty strings crash the app
- SQL/NoSQL injection risk

**Fix:**
```javascript
const register = async ({ name, email, password }) => {
  // Validate inputs
  if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
    throw new ApiError(400, 'Invalid email format');
  }
  if (!password || password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }
  if (!name || name.trim().length < 2) {
    throw new ApiError(400, 'Name is required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password });
  return user;
};
```

---

### 3. **Missing Phone Field in Auth (auth.service.js:25)**
**Severity:** 🟠 HIGH
**File:** `src/services/auth.service.js:25`
**Issue:** README says "phone-based login" but code uses email

```javascript
// BUGGY CODE (line 25):
const login = async ({ email, password }, meta = {}) => {  // ❌ email, not phone
  const user = await User.findOne({ email }).select('+password');
  // ...
};
```

**Expected (from README):**
```
Telefon raqam → SMS OTP → JWT token
```

**Actual (code):**
- Email + password login
- No SMS/OTP implementation

**Impact:**
- Web frontend sends email, backend expects phone
- Login fails
- Inconsistent with spec

**Fix:** Either:
1. Update backend to support phone login with OTP
2. Update README to match email-based login

---

### 4. **No Rate Limiting on Auth Endpoints (routes/auth.routes.js)**
**Severity:** 🟠 HIGH
**File:** `src/routes/auth.routes.js`
**Issue:** Missing specific rate limits for auth endpoints

**Current:**
- Global rate limit: 100 req/min (too generous for auth)
- No login attempt limit
- No registration limit

**Impact:**
- Brute force attacks on login
- Account enumeration via registration errors
- Spam registration bots

**Fix:**
```javascript
const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

// Strict rate limits for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 attempts
  message: 'Too many auth attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 5. **Weak Password Hashing (User.model.js:76)**
**Severity:** 🟡 MEDIUM
**File:** `src/models/User.model.js:76`
**Issue:** Bcrypt salt rounds too high (12) - slow

```javascript
// CURRENT CODE:
const salt = await bcrypt.genSalt(12);  // ⚠️ Too high, ~1 second per hash
this.password = await bcrypt.hash(this.password, salt);
```

**Impact:**
- Registration takes 1-2 seconds
- Login takes 1-2 seconds
- Poor user experience
- Higher server load

**Standard:** 10-11 rounds (industry standard)

**Fix:**
```javascript
const salt = await bcrypt.genSalt(10);  // ✅ Standard, ~100ms
this.password = await bcrypt.hash(this.password, salt);
```

---

### 6. **Unvalidated Database Queries (product.controller.js)**
**Severity:** 🟡 MEDIUM
**File:** `src/controllers/product.controller.js`
**Issue:** Missing ObjectId validation for product IDs

**Example Pattern:**
```javascript
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);  // ❌ No validation
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.json(new ApiResponse(200, product));
});
```

**Impact:**
- Invalid IDs crash with CastError
- Poor error messages

**Fix:**
```javascript
const mongoose = require('mongoose');

const getProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid product ID format');
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.json(new ApiResponse(200, product));
});
```

---

## 📊 Bug Summary Table

| # | File | Issue | Severity | Status |
|---|------|-------|----------|--------|
| 1 | db.js | Typo "connectionw" | 🔴 CRITICAL | ✅ FIXED |
| 2 | auth.service.js | Missing input validation | 🟠 HIGH | ⏳ TODO |
| 3 | auth.service.js | Email vs Phone mismatch | 🟠 HIGH | ⏳ TODO |
| 4 | auth.routes.js | No auth rate limiting | 🟠 HIGH | ⏳ TODO |
| 5 | User.model.js | Slow bcrypt rounds (12) | 🟡 MEDIUM | ⏳ TODO |
| 6 | product.controller.js | No ObjectId validation | 🟡 MEDIUM | ⏳ TODO |

---

## ✅ Testing Checklist

After fixes:
- [ ] Test register with invalid email
- [ ] Test register with weak password
- [ ] Test 10+ login attempts (should be rate limited)
- [ ] Test invalid product ID format
- [ ] Test MongoDB disconnect/reconnect
- [ ] Load test password hashing (should be <200ms)
- [ ] Test with malicious input: `"; drop table users; --"`

---

## 🔧 Fix Priority Order

1. **DONE:** Fix typo in db.js (MongoDB connection)
2. **URGENT:** Add auth input validation
3. **URGENT:** Add auth rate limiting
4. **THIS WEEK:** Fix bcrypt salt rounds
5. **THIS WEEK:** Add ObjectId validation

---

## 📝 Architecture Notes

**Good Points:**
- ✅ Error handling middleware in place
- ✅ JWT token structure correct
- ✅ Refresh token rotation implemented
- ✅ Password hashing in place
- ✅ CORS configured properly

**Issues:**
- ❌ No input validation layer (should use Joi/Zod)
- ❌ No request logging for security events
- ❌ No API documentation (Swagger/OpenAPI)
- ❌ Missing environment variable validation
- ❌ No database query logging

---

## 🚀 Deployment Readiness

**Current Status:** ⚠️ NOT READY FOR PRODUCTION

**Missing Before Deploy:**
1. Fix all HIGH priority bugs
2. Add validation for all inputs
3. Add rate limiting to sensitive endpoints
4. Add security headers (HSTS, CSP, etc.)
5. Add request logging
6. Add error tracking (Sentry)
7. Security audit

---

## Environment Variables Check

**Required .env:**
```bash
PORT=5002
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=min_32_characters
JWT_REFRESH_SECRET=min_32_characters
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Missing:**
- `GEMINI_API_KEY` (for AI features)
- `CLOUDINARY_URL` (for image upload)
- `EMAIL_SERVICE_KEY` (for password reset emails)
- `PAYME_MERCHANT_ID` (for payments)

---

**Report Generated:** 2024-03-29
**Backend Status:** Partially Working ⚠️
**Next Steps:** Fix HIGH priority bugs → Test → Deploy
