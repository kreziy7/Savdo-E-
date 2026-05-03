#!/bin/bash
# Linux/Mac uchun dev script
# Ishga tushirish: bash dev.sh yoki ./dev.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[DEV]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; exit 1; }

# ── Node.js tekshirish ────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  err "Node.js topilmadi. https://nodejs.org dan o'rnating (v18+)."
fi

# ── .env fayllar tekshirish va yaratish ──────────────────────────────────────
if [ ! -f "$ROOT/backend/.env" ]; then
  warn "backend/.env topilmadi — .env.example dan nusxa olinmoqda..."
  cp "$ROOT/backend/.env.example" "$ROOT/backend/.env"
  log "backend/.env yaratildi ✓"
fi

if [ ! -f "$ROOT/web/.env" ]; then
  warn "web/.env topilmadi — .env.example dan nusxa olinmoqda..."
  cp "$ROOT/web/.env.example" "$ROOT/web/.env"
  log "web/.env yaratildi ✓"
fi

# ── Dependencies o'rnatish ────────────────────────────────────────────────────
install_if_needed() {
  local dir="$1" name="$2"
  if [ ! -d "$dir/node_modules" ]; then
    log "$name: npm install..."
    (cd "$dir" && npm install --silent)
    log "$name — o'rnatildi ✓"
  fi
}

install_if_needed "$ROOT"           "Root"
install_if_needed "$ROOT/backend"   "Backend"
install_if_needed "$ROOT/web"       "Web"
install_if_needed "$ROOT/web/admin" "Admin"

# ── Portlarni tozalash (faqat o'z processlarimizni to'xtatamiz) ──────────────
for PORT in 3001 5173 5174; do
  PID=$(lsof -ti:$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    # AirPlay yoki system processlarni o'ldirmaymiz
    PNAME=$(ps -p $PID -o comm= 2>/dev/null || true)
    if echo "$PNAME" | grep -qiE "node|vite"; then
      warn "Port $PORT band ($PNAME PID $PID) — tozalanmoqda..."
      kill -9 $PID 2>/dev/null || true
    else
      warn "Port $PORT ni '$PNAME' ishlatmoqda — o'tkazib yuborildi"
    fi
  fi
done

# ── MongoDB ishga tushirish ───────────────────────────────────────────────────
log "MongoDB tekshirilmoqda..."

MONGO_READY=false

# 1. Avval local mongod tekshir
if command -v mongod &>/dev/null; then
  if ! pgrep -x mongod &>/dev/null; then
    log "Local mongod ishga tushirilmoqda..."
    mkdir -p /tmp/savdo_mongo_data
    mongod --dbpath /tmp/savdo_mongo_data --port 27017 --fork \
      --logpath /tmp/savdo_mongo.log --bind_ip 127.0.0.1 &>/dev/null || true
    sleep 2
  fi
  if pgrep -x mongod &>/dev/null; then
    log "Local MongoDB tayyor ✓"
    MONGO_READY=true
  fi
fi

# 2. Docker bilan urinib ko'r
if [ "$MONGO_READY" = false ] && command -v docker &>/dev/null; then
  log "Docker bilan MongoDB ishga tushirilmoqda..."

  # Konflikt bo'lsa to'xtat
  CONFLICT=$(docker ps --format '{{.Names}}' --filter "publish=27017" 2>/dev/null | grep -v "^savdo_mongo$" || true)
  if [ -n "$CONFLICT" ]; then
    warn "Port 27017 ni '$CONFLICT' ishlatmoqda — to'xtatilmoqda..."
    docker stop "$CONFLICT" &>/dev/null || true
  fi

  if docker inspect savdo_mongo &>/dev/null; then
    docker start savdo_mongo &>/dev/null || true
  else
    docker run -d --name savdo_mongo \
      -p 127.0.0.1:27017:27017 \
      -v savdo_mongo_data:/data/db \
      mongo:7 &>/dev/null
  fi

  # Tayyor bo'lishini kut (30 sek)
  for i in $(seq 1 30); do
    if docker exec savdo_mongo mongosh --quiet --eval "db.runCommand({ping:1})" &>/dev/null; then
      log "Docker MongoDB tayyor ✓"
      MONGO_READY=true
      break
    fi
    sleep 1
  done
fi

if [ "$MONGO_READY" = false ]; then
  echo ""
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  [WARN] MongoDB topilmadi — backend ishlamaydi!${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "  macOS da o'rnatish:"
  echo "  brew tap mongodb/brew && brew install mongodb-community"
  echo "  brew services start mongodb-community"
  echo ""
  echo "  Yoki Docker: docker run -d -p 27017:27017 mongo:7"
  echo ""
  echo "  Yoki backend/.env da Atlas URI ni o'rnating:"
  echo "  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/savdo_db"
  echo ""
  echo -e "${YELLOW}  Web va Admin shunga qaramay ishga tushirilmoqda...${NC}"
  echo ""
fi

# ── Cleanup ───────────────────────────────────────────────────────────────────
PIDS=()
cleanup() {
  echo ""
  log "Tugatilmoqda..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  # Local mongod fork bo'lsa to'xtat
  if command -v mongod &>/dev/null; then
    pkill -x mongod 2>/dev/null || true
  fi
  wait 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

# ── Backend (port 3001) ───────────────────────────────────────────────────────
log "Backend ishga tushirilmoqda (port 3001)..."
(cd "$ROOT/backend" && node --watch src/server.js 2>&1 | sed 's/^/[BACKEND] /') &
PIDS+=($!)

for i in $(seq 1 15); do
  if nc -z localhost 3001 2>/dev/null; then
    log "Backend tayyor ✓ (MongoDB ${MONGO_READY})"
    break
  fi
  sleep 1
done

# ── Web (port 5173) ───────────────────────────────────────────────────────────
log "Web ishga tushirilmoqda (port 5173)..."
(cd "$ROOT/web" && npx vite 2>&1 | sed 's/^/[WEB] /') &
PIDS+=($!)

# ── Admin (port 5174) ─────────────────────────────────────────────────────────
log "Admin ishga tushirilmoqda (port 5174)..."
(cd "$ROOT/web/admin" && npx vite 2>&1 | sed 's/^/[ADMIN] /') &
PIDS+=($!)

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Backend  →  http://localhost:3001${NC}"
echo -e "${GREEN}  Web      →  http://localhost:5173${NC}"
echo -e "${GREEN}  Admin    →  http://localhost:5174${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Tugatish uchun ${YELLOW}Ctrl+C${NC} bosing"
echo ""

wait
