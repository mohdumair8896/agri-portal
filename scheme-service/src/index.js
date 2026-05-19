// ============================================================
// Scheme Service — Entry Point
// Port: 8083
// ============================================================
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const schemeRoutes = require('./routes/schemes');

const app  = express();
const PORT = process.env.PORT || 8083;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`[scheme-service] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/schemes', schemeRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'scheme-service', port: PORT, timestamp: new Date() });
});

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error('[scheme-service] Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[scheme-service] Running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
