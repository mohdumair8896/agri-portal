// ============================================================
// Crop Service — Database Connection (PostgreSQL)
// ============================================================
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'agridb',
  user:     process.env.DB_USER     || 'agriuser',
  password: process.env.DB_PASSWORD || 'agripassword',
});

pool.on('connect', () => console.log('[crop-service] Connected to PostgreSQL'));
pool.on('error',   (err) => console.error('[crop-service] Pool error:', err.message));

module.exports = pool;
