# ============================================================
# Farmer Service — Dockerfile
# Optimized multi-stage Node.js build
# Exposes port 8081
# ============================================================

# ── Stage 1: Dependency Installation ─────────────────────────
FROM node:20-alpine AS deps

# Set working directory
WORKDIR /app

# Copy only package files first (Docker layer cache optimization)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev && npm cache clean --force

# ── Stage 2: Production Image ─────────────────────────────────
FROM node:20-alpine AS production

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodeuser:nodejs src/ ./src/
COPY --chown=nodeuser:nodejs package*.json ./

# Switch to non-root user
USER nodeuser

# Expose service port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8081/health || exit 1

# Start application
CMD ["node", "src/index.js"]
