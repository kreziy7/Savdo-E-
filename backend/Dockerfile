# ── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup -S savdo && adduser -S savdo -G savdo

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN chown -R savdo:savdo /app
USER savdo

EXPOSE 5000
CMD ["node", "src/server.js"]
