#!/bin/bash

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[DEV]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; exit 1; }

# ── Docker tekshirish ─────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  err "Docker topilmadi. https://docs.docker.com/get-docker/ dan o'rnating."
fi

# ── Node.js tekshirish ────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  err "Node.js topilmadi. https://nodejs.org dan o'rnating (v18+)."
fi

# ── .env fayl tekshirish ──────────────────────────────────────────────────────
if [ ! -f "$ROOT/backend/.env" ]; then
  warn "backend/.env topilmadi — .env.example dan nusxa olinmoqda..."
  cp "$ROOT/backend/.env.example" "$ROOT/backend/.env"
  warn "backend/.env yaratildi. Kerakli qiymatlarni to'ldiring va qayta ishga tushiring."
fi

# ── Dependencies o'rnatish ────────────────────────────────────────────────────
install_if_needed() {
  local dir="$1"
  local name="$2"
  if [ ! -d "$dir/node_modules" ]; then
    log "$name uchun npm install..."
    (cd "$dir" && npm install --silent)
    log "$name — o'rnatildi ✓"
  fi
}

install_if_needed "$ROOT"          "Root"
install_if_needed "$ROOT/backend"  "Backend"
install_if_needed "$ROOT/web"      "Web"
install_if_needed "$ROOT/web/admin" "Admin"

# ── Cleanup on exit ───────────────────────────────────────────────────────────
PIDS=()
cleanup() {
  echo ""
  log "Tugatilmoqda..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM

# ── MongoDB ───────────────────────────────────────────────────────────────────
log "MongoDB tekshirilmoqda..."

# Port 27017 ni boshqa container ishlatayotgan bo'lsa to'xtatish
CONFLICT=$(docker ps --format '{{.Names}}' --filter "publish=27017" 2>/dev/null | grep -v "^savdo_mongo$" || true)
if [ -n "$CONFLICT" ]; then
  warn "Port 27017 ni '$CONFLICT' ishlatmoqda — to'xtatilmoqda..."
  docker stop "$CONFLICT" 2>/dev/null || true
fi

# savdo_mongo port binding bor-yo'qligini tekshirish
if docker inspect savdo_mongo &>/dev/null; then
  MONGO_PORT=$(docker inspect savdo_mongo 2>/dev/null \
    | grep -A3 '"27017/tcp"' | grep '"HostPort"' | head -1 \
    | tr -d ' "' | cut -d: -f2 || true)

  if [ -z "$MONGO_PORT" ]; then
    warn "savdo_mongo port binding yo'q — qayta yaratilmoqda..."
    docker rm -f savdo_mongo 2>/dev/null || true
    docker run -d --name savdo_mongo \
      -p 127.0.0.1:27017:27017 \
      -v savdo_mongo_data:/data/db \
      mongo:7
  else
    docker start savdo_mongo 2>/dev/null || true
  fi
else
  log "savdo_mongo yaratilmoqda..."
  docker run -d --name savdo_mongo \
    -p 127.0.0.1:27017:27017 \
    -v savdo_mongo_data:/data/db \
    mongo:7
fi

# MongoDB tayyor bo'lishini kutish (max 30 sek)
log "MongoDB tayyor bo'lishini kutilmoqda..."
for i in $(seq 1 30); do
  if docker exec savdo_mongo mongosh --quiet --eval "db.runCommand({ping:1})" &>/dev/null; then
    log "MongoDB tayyor! ✓"
    break
  fi
  if [ "$i" -eq 30 ]; then
    err "MongoDB 30 sekundda ishga tushmadi. 'docker logs savdo_mongo' tekshiring."
  fi
  sleep 1
done

# ── Backend (port 5000) ───────────────────────────────────────────────────────
log "Backend ishga tushirilmoqda (port 5000)..."
(cd "$ROOT/backend" && npx nodemon src/server.js 2>&1 | sed 's/^/[BACKEND] /') &
PIDS+=($!)

# Backend portini kutish (max 15 sek)
for i in $(seq 1 15); do
  if nc -z localhost 5000 2>/dev/null; then
    log "Backend tayyor! ✓"
    break
  fi
  sleep 1
done

# ── Web (port 5173) ───────────────────────────────────────────────────────────
log "Web ishga tushirilmoqda (port 5173)..."
(cd "$ROOT/web" && npm run dev 2>&1 | sed 's/^/[WEB] /') &
PIDS+=($!)

# ── Admin (port 5174) ─────────────────────────────────────────────────────────
log "Admin ishga tushirilmoqda (port 5174)..."
(cd "$ROOT/web/admin" && npm run dev 2>&1 | sed 's/^/[ADMIN] /') &
PIDS+=($!)

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Backend  →  http://localhost:5000${NC}"
echo -e "${GREEN}  Web      →  http://localhost:5173${NC}"
echo -e "${GREEN}  Admin    →  http://localhost:5174${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Tugatish uchun ${YELLOW}Ctrl+C${NC} bosing"
echo ""

wait
