# 🐛 Web Platform Bug Report

**Date:** March 29, 2024
**Status:** Critical Bugs Found ✗
**Total Issues:** 8 (3 Critical, 3 High, 2 Medium)

---

## 🔴 CRITICAL BUGS

### 1. **Missing Dependency in useEffect (App.jsx:26)**
**Severity:** 🔴 CRITICAL
**File:** `src/App.jsx:26`
**Issue:** Missing `user` in dependency array causes stale closure

```jsx
// BUGGY CODE (lines 22-26):
useEffect(() => {
  if (accessToken && !user) {
    fetchMe();
  }
}, [accessToken]);  // ❌ Missing 'user' dependency
```

**Impact:** useEffect reads stale `user` value, may cause infinite loops or missed updates

**Fix:**
```jsx
useEffect(() => {
  if (accessToken && !user) {
    fetchMe();
  }
}, [accessToken, user, fetchMe]);  // ✅ Add dependencies
```

---

### 2. **Race Condition in Token Refresh (axios.js:22-31)**
**Severity:** 🔴 CRITICAL
**File:** `src/api/axios.js:22-31`
**Issue:** `failedQueue` is shared state that can be corrupted in concurrent requests

```javascript
// BUGGY CODE:
let isRefreshing = false;
let failedQueue = [];  // ❌ Global mutable state

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];  // ❌ Can be accessed by multiple concurrent requests
};
```

**Impact:**
- If multiple 401 errors occur simultaneously, failedQueue can lose requests
- Race condition between checking `isRefreshing` and setting it
- Requests may be dropped silently

**Fix:**
```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];  // Reset after processing
};

// Add proper locking mechanism:
if (isRefreshing && originalRequest._retry) {
  // Don't re-enter refresh logic
  return;
}
```

---

### 3. **Unhandled Promise Rejection in Dashboard (Dashboard.jsx:79)**
**Severity:** 🔴 CRITICAL
**File:** `src/pages/Dashboard.jsx:78-81`
**Issue:** logout promise rejection not handled

```jsx
// BUGGY CODE (lines 78-81):
const handleLogout = async () => {
  await logout();  // ❌ No error handling
  navigate('/login');
};
```

**Impact:** If logout API call fails, user is still redirected and app may be in inconsistent state

**Fix:**
```jsx
const handleLogout = async () => {
  try {
    await logout();
    navigate('/login');
  } catch (err) {
    // Handle logout error but still clear local state
    localStorage.clear();
    navigate('/login');
  }
};
```

---

## 🟠 HIGH PRIORITY BUGS

### 4. **Missing Error Handling in fetchMe (authStore.js:70-77)**
**Severity:** 🟠 HIGH
**File:** `src/store/authStore.js:70-77`
**Issue:** Silent error handling masks real issues

```jsx
// BUGGY CODE:
fetchMe: async () => {
  try {
    const res = await authApi.getMe();
    set({ user: res.data.data.user });
  } catch (_) {  // ❌ Swallowing errors silently
    set({ user: null, accessToken: null, refreshToken: null });
  }
},
```

**Impact:**
- Network errors silently log user out
- User doesn't know why they were logged out
- Debugging difficult

**Fix:**
```jsx
fetchMe: async () => {
  try {
    const res = await authApi.getMe();
    set({ user: res.data.data.user });
  } catch (err) {
    console.error('fetchMe failed:', err);
    // Only logout if 401/403, otherwise show error
    if (err.response?.status === 401 || err.response?.status === 403) {
      set({ user: null, accessToken: null, refreshToken: null });
    } else {
      toast.error('Failed to load user profile');
    }
  }
},
```

---

### 5. **Email Instead of Phone for Login (Login.jsx:9)**
**Severity:** 🟠 HIGH
**File:** `src/pages/Login.jsx:9`
**Issue:** Form uses email field but backend expects phone number

```jsx
// BUGGY CODE (line 9):
const [form, setForm] = useState({ email: '', password: '' });
// ...
// Line 35: await login({ email: form.email, password: form.password });
```

**Context:** README states "Telefon raqam → SMS OTP → JWT token" but code uses email

**Impact:** Login won't work, API will reject with missing phone field

**Fix:**
```jsx
const [form, setForm] = useState({ phone: '', password: '' });
// Update all references from 'email' to 'phone'
```

---

### 6. **Inconsistent Data Structure (Dashboard.jsx:63-64)**
**Severity:** 🟠 HIGH
**File:** `src/pages/Dashboard.jsx:63-64`
**Issue:** Accessing potentially undefined nested properties without null checks

```jsx
// BUGGY CODE:
const summary = summaryData?.data?.data || {};
const todayStats = summary.today || {};  // ✅ Good fallback
const lowStock = summary.lowStock || [];  // ✅ Good fallback

// But later (line 67):
const allSales = salesData?.data?.data?.sales || [];
const recentSales = Array.isArray(allSales) ? allSales.slice(0, 5) : [];
```

**Issue:** If backend response structure changes unexpectedly, app crashes

**Impact:** Sensitive to API response format changes

---

## 🟡 MEDIUM PRIORITY BUGS

### 7. **Memory Leak: Query Subscriptions Not Cleaned Up (Products.jsx)**
**Severity:** 🟡 MEDIUM
**File:** `src/pages/Products.jsx:33-36`
**Issue:** Query doesn't have cleanup on unmount

```jsx
// Code:
const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsApi.getProducts(),
});
```

**Better Practice:**
```jsx
const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsApi.getProducts(),
  staleTime: 5 * 60 * 1000,  // 5 minutes
  gcTime: 10 * 60 * 1000,    // 10 minutes garbage collection
  retry: 1,                   // Only retry once
});
```

---

### 8. **localStorage Used Twice for Same Token (authStore.js:45-46 & axios.js:14)**
**Severity:** 🟡 MEDIUM
**File:** `src/store/authStore.js` & `src/api/axios.js`
**Issue:** Token stored in localStorage but also read from it, no synchronization

```javascript
// authStore.js (line 45):
localStorage.setItem('accessToken', accessToken);

// axios.js (line 14):
const token = localStorage.getItem('accessToken');
```

**Issue:** If token updated in one place, other parts might have stale value

**Fix:** Use Zustand store consistently throughout:
```javascript
// axios.js:
api.interceptors.request.use((config) => {
  // Get from Zustand store instead
  const state = useAuthStore.getState();
  const token = state.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 📊 Bug Summary Table

| # | File | Issue | Severity | Type |
|---|------|-------|----------|------|
| 1 | App.jsx | Missing dependency | 🔴 CRITICAL | Logic |
| 2 | axios.js | Race condition in token refresh | 🔴 CRITICAL | Concurrency |
| 3 | Dashboard.jsx | Unhandled promise rejection | 🔴 CRITICAL | Error Handling |
| 4 | authStore.js | Silent error in fetchMe | 🟠 HIGH | Error Handling |
| 5 | Login.jsx | Email vs Phone mismatch | 🟠 HIGH | API Integration |
| 6 | Dashboard.jsx | Inconsistent data structure | 🟠 HIGH | Data Handling |
| 7 | Products.jsx | Query cleanup missing | 🟡 MEDIUM | Memory |
| 8 | authStore.js | localStorage duplication | 🟡 MEDIUM | State Management |

---

## 🔧 Fix Priority Order

1. **IMMEDIATELY:** Fix bugs #1, #2, #3 (app stability)
2. **URGENT:** Fix bugs #4, #5 (core functionality)
3. **THIS WEEK:** Fix bugs #6, #7, #8 (quality)

---

## ✅ Testing Recommendations

After fixes:
1. Test logout while loading dashboard
2. Test simultaneous 401 errors
3. Test login with phone vs email
4. Test API response variations
5. Test memory usage with repeated navigation
6. Test localStorage sync across tabs

---

## 📝 Notes

- No TypeScript used (all `.js` and `.jsx` files) — consider migrating for type safety
- No error boundaries in place
- Missing input sanitization in some forms
- No retry logic for failed API calls

---

**Report Generated:** 2024-03-29
**Reviewed By:** Code Analysis
