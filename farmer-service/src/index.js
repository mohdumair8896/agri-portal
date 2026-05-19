// ============================================================
// Farmer Service — Entry Point
// Port: 8081
// ============================================================
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const farmerRoutes = require('./routes/farmers');

const app  = express();
const PORT = process.env.PORT || 8081;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request Logger ────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[farmer-service] ${req.method} ${req.originalUrl}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/farmers', farmerRoutes);

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'farmer-service', port: PORT, timestamp: new Date() });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[farmer-service] Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[farmer-service] Running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
