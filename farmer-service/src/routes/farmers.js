// ============================================================
// Farmer Service — Routes
// ============================================================
const express  = require('express');
const router   = express.Router();
const { body, validationResult } = require('express-validator');
const pool     = require('../db');

// ── GET /api/farmers ─────────────────────────────────────────
// List all farmers (with optional district/tehsil filter)
router.get('/', async (req, res) => {
  try {
    const { district, tehsil } = req.query;
    let query = 'SELECT * FROM farmer_schema.farmers';
    const params = [];

    if (district || tehsil) {
      query += ' WHERE';
      if (district) { params.push(district); query += ` district = $${params.length}`; }
      if (district && tehsil) query += ' AND';
      if (tehsil)   { params.push(tehsil);   query += ` tehsil = $${params.length}`; }
    }
    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/farmers/:id ──────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM farmer_schema.farmers WHERE id = $1', [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── POST /api/farmers ─────────────────────────────────────────
router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().isMobilePhone().withMessage('Valid phone is required'),
    body('district').notEmpty().withMessage('District is required'),
    body('tehsil').notEmpty().withMessage('Tehsil is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, phone, email, district, tehsil, land_acres } = req.body;
      const result = await pool.query(
        `INSERT INTO farmer_schema.farmers (name, phone, email, district, tehsil, land_acres)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [name, phone, email || null, district, tehsil, land_acres || 0]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      if (err.code === '23505')
        return res.status(409).json({ success: false, message: 'Phone number already registered' });
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// ── PUT /api/farmers/:id ──────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { name, email, district, tehsil, land_acres } = req.body;
    const result = await pool.query(
      `UPDATE farmer_schema.farmers
       SET name=$1, email=$2, district=$3, tehsil=$4, land_acres=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [name, email, district, tehsil, land_acres, req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── DELETE /api/farmers/:id ───────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM farmer_schema.farmers WHERE id=$1 RETURNING id', [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, message: `Farmer ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
