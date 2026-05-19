# ============================================================
# Scheme Service — Dockerfile
# Optimized multi-stage Node.js build
# Exposes port 8083
# ============================================================

# ── Stage 1: Dependency Installation ─────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev && npm cache clean --force

# ── Stage 2: Production Image ─────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

WORKDIR /app

COPY --from=deps --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs src/ ./src/
COPY --chown=nodeuser:nodejs package*.json ./

USER nodeuser

EXPOSE 8083

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8083/health || exit 1

CMD ["node", "src/index.js"]
