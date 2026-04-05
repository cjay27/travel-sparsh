const express = require('express');
const { body, param, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/airports — public, returns all active airports
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, iata_code, name, city, state, country FROM airports WHERE is_active = 1 ORDER BY city'
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/airports/search?q=del
router.get('/search', async (req, res) => {
  const q = `%${req.query.q || ''}%`;
  try {
    const [rows] = await pool.query(
      `SELECT id, iata_code, name, city, state FROM airports
       WHERE is_active = 1 AND (city LIKE ? OR iata_code LIKE ? OR name LIKE ?)
       ORDER BY city LIMIT 20`,
      [q, q, q]
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Admin CRUD ──

// GET /api/airports/admin/all
router.get('/admin/all', authenticate, requireAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM airports ORDER BY city');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/airports
router.post('/', authenticate, requireAdmin,
  body('iata_code').trim().isLength({ min: 3, max: 3 }).toUpperCase(),
  body('name').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { iata_code, name, city, state, country = 'India' } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO airports (iata_code, name, city, state, country) VALUES (?, ?, ?, ?, ?)',
        [iata_code.toUpperCase(), name, city, state, country]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY')
        return res.status(409).json({ success: false, message: 'IATA code already exists' });
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// PUT /api/airports/:id
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { iata_code, name, city, state, country, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE airports SET iata_code=?, name=?, city=?, state=?, country=?, is_active=? WHERE id=?',
      [iata_code, name, city, state, country, is_active ?? 1, req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/airports/:id
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE airports SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
