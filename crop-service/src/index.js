// ============================================================
// Crop Service — Entry Point
// Port: 8082
// ============================================================
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const cropRoutes = require('./routes/crops');

const app  = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`[crop-service] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/crops', cropRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'crop-service', port: PORT, timestamp: new Date() });
});

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error('[crop-service] Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[crop-service] Running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
