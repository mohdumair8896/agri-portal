// ============================================================
// Scheme Service — Routes
// ============================================================
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// ── GET /api/schemes ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scheme_schema.schemes ORDER BY id ASC'
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/schemes/:id ──────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scheme_schema.schemes WHERE id=$1', [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── POST /api/schemes/check-eligibility ───────────────────────
// Body: { farmer_id, land_acres, crop_name }
// Returns: list of eligible schemes for the farmer
router.post('/check-eligibility', async (req, res) => {
  try {
    const { land_acres, crop_name } = req.body;
    if (land_acres === undefined)
      return res.status(400).json({ success: false, message: 'land_acres is required' });

    const result = await pool.query(
      `SELECT * FROM scheme_schema.schemes
       WHERE min_land_acres <= $1 AND max_land_acres >= $1
       ORDER BY benefit_amount DESC`,
      [land_acres]
    );

    // optionally filter by crop if provided
    let schemes = result.rows;
    if (crop_name) {
      schemes = schemes.filter(s =>
        s.eligible_crops === 'All Crops' ||
        s.eligible_crops.toLowerCase().includes(crop_name.toLowerCase())
      );
    }

    res.json({
      success: true,
      farmer_land_acres: land_acres,
      eligible_count: schemes.length,
      schemes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── POST /api/schemes/apply ───────────────────────────────────
router.post('/apply', async (req, res) => {
  try {
    const { farmer_id, scheme_id } = req.body;
    if (!farmer_id || !scheme_id)
      return res.status(400).json({ success: false, message: 'farmer_id and scheme_id are required' });

    const result = await pool.query(
      `INSERT INTO scheme_schema.applications (farmer_id, scheme_id)
       VALUES ($1,$2) RETURNING *`,
      [farmer_id, scheme_id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/schemes/applications/:farmer_id ─────────────────
router.get('/applications/:farmer_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, s.scheme_name, s.benefit_amount
       FROM scheme_schema.applications a
       JOIN scheme_schema.schemes s ON a.scheme_id = s.id
       WHERE a.farmer_id = $1
       ORDER BY a.applied_at DESC`,
      [req.params.farmer_id]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
