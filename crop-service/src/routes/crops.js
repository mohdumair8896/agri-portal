// ============================================================
// Crop Service — Routes
// ============================================================
const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const pool    = require('../db');

// ── GET /api/crops ────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { farmer_id, season, status } = req.query;
    let query  = 'SELECT * FROM crop_schema.crops';
    const conditions = [];
    const params = [];

    if (farmer_id) { params.push(farmer_id); conditions.push(`farmer_id = $${params.length}`); }
    if (season)    { params.push(season);    conditions.push(`season = $${params.length}`);    }
    if (status)    { params.push(status);    conditions.push(`status = $${params.length}`);    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── GET /api/crops/:id ────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM crop_schema.crops WHERE id = $1', [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── POST /api/crops ───────────────────────────────────────────
router.post('/',
  [
    body('farmer_id').isInt({ min: 1 }).withMessage('Valid farmer_id is required'),
    body('crop_name').notEmpty().withMessage('crop_name is required'),
    body('season').isIn(['Kharif','Rabi','Zaid']).withMessage('season must be Kharif, Rabi, or Zaid'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { farmer_id, crop_name, season, area_acres, sown_date, status } = req.body;
      const result = await pool.query(
        `INSERT INTO crop_schema.crops (farmer_id, crop_name, season, area_acres, sown_date, status)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [farmer_id, crop_name, season, area_acres || 0, sown_date || null, status || 'Growing']
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// ── PUT /api/crops/:id ────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { crop_name, season, area_acres, sown_date, status } = req.body;
    const result = await pool.query(
      `UPDATE crop_schema.crops
       SET crop_name=$1, season=$2, area_acres=$3, sown_date=$4, status=$5
       WHERE id=$6 RETURNING *`,
      [crop_name, season, area_acres, sown_date, status, req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ── DELETE /api/crops/:id ─────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM crop_schema.crops WHERE id=$1 RETURNING id', [req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    res.json({ success: true, message: `Crop ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
