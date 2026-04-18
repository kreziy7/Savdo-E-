@echo off
:: Windows uchun dev script (Xasan uchun)
:: Ishga tushirish: dev.bat ni ikki marta bosing yoki CMD da: dev.bat

title Savdo-E Dev Server
color 0A

echo.
echo  =====================================
echo    Savdo-E - Dev Server (Windows)
echo  =====================================
echo.

:: ── Node.js tekshirish ─────────────────────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
  echo [ERR] Node.js topilmadi!
  echo       https://nodejs.org dan LTS versiyani o'rnating.
  pause
  exit /b 1
)

:: ── .env fayllar yaratish ──────────────────────────────────────────────────
if not exist "backend\.env" (
  echo [WARN] backend\.env topilmadi - .env.example dan nusxa olinmoqda...
  copy "backend\.env.example" "backend\.env" >nul
  echo [OK] backend\.env yaratildi
)

if not exist "web\.env" (
  echo [WARN] web\.env topilmadi - .env.example dan nusxa olinmoqda...
  copy "web\.env.example" "web\.env" >nul
  echo [OK] web\.env yaratildi
)

:: ── MongoDB tekshirish ─────────────────────────────────────────────────────
echo [DEV] MongoDB tekshirilmoqda...

:: MongoDB ishlaydimi?
mongosh --quiet --eval "db.adminCommand('ping')" >nul 2>&1
if errorlevel 1 (
  :: MongoDB ishlamayapti - ishga tushirish
  where mongod >nul 2>&1
  if errorlevel 1 (
    echo.
    echo  ============================================
    echo   [ERR] MongoDB topilmadi!
    echo  ============================================
    echo.
    echo   O'rnatish uchun:
    echo   1. https://www.mongodb.com/try/download/community
    echo   2. Windows x64 MSI yuklab o'rnating
    echo   3. "Install MongoD as a Service" ni belgilang
    echo   4. Qayta ishga tushiring: dev.bat
    echo.
    pause
    exit /b 1
  )
  echo [DEV] MongoDB ishga tushirilmoqda...
  if not exist "%TEMP%\savdo_mongo_data" mkdir "%TEMP%\savdo_mongo_data"
  start /B mongod --dbpath "%TEMP%\savdo_mongo_data" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1
  timeout /t 3 /nobreak >nul
)

echo [OK] MongoDB tayyor!

:: ── Dependencies o'rnatish ─────────────────────────────────────────────────
if not exist "backend\node_modules" (
  echo [DEV] Backend: npm install...
  cd backend && npm install --silent && cd ..
)
if not exist "web\node_modules" (
  echo [DEV] Web: npm install...
  cd web && npm install --silent && cd ..
)
if not exist "web\admin\node_modules" (
  echo [DEV] Admin: npm install...
  cd web\admin && npm install --silent && cd ..\..
)

:: ── Xizmatlarni ishga tushirish ────────────────────────────────────────────
echo.
echo [DEV] Xizmatlar ishga tushirilmoqda...
echo.

:: Har biri alohida CMD oynasida ochiladi
start "BACKEND - port 5000" cmd /k "cd /d %~dp0backend && npx nodemon src/server.js"
timeout /t 3 /nobreak >nul

start "WEB - port 5173" cmd /k "cd /d %~dp0web && npm run dev"
timeout /t 1 /nobreak >nul

start "ADMIN - port 5174" cmd /k "cd /d %~dp0web\admin && npm run dev"

echo.
echo  ============================================
echo    Backend  -^>  http://localhost:5000
echo    Web      -^>  http://localhost:5173
echo    Admin    -^>  http://localhost:5174
echo  ============================================
echo.
echo   3 ta yangi oyna ochildi.
echo   Tugatish uchun har bir oynada Ctrl+C bosing.
echo.
pause
