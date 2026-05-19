# ============================================================
# Angular UI — Dockerfile
# Multi-stage: Node.js build + NGINX serve
# Exposes port 80 (mapped externally to 4200)
# ============================================================

# ── Stage 1: Node.js Build ────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including devDeps for build)
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build Angular for production
RUN npm run build

# ── Stage 2: NGINX Serve ──────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove default NGINX config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files from builder stage
COPY --from=builder /app/dist/agri-portal-ui/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
