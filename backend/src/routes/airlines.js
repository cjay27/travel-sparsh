const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/airlines — public
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, code, name, logo_url, is_domestic FROM airlines WHERE is_active = 1 ORDER BY name'
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/airlines/admin/all
router.get('/admin/all', authenticate, requireAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM airlines ORDER BY name');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/airlines
router.post('/', authenticate, requireAdmin,
  body('code').trim().notEmpty(),
  body('name').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { code, name, logo_url, is_domestic = 1 } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO airlines (code, name, logo_url, is_domestic) VALUES (?, ?, ?, ?)',
        [code.toUpperCase(), name, logo_url || null, is_domestic]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY')
        return res.status(409).json({ success: false, message: 'Airline code already exists' });
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// PUT /api/airlines/:id
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { code, name, logo_url, is_domestic, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE airlines SET code=?, name=?, logo_url=?, is_domestic=?, is_active=? WHERE id=?',
      [code, name, logo_url || null, is_domestic ?? 1, is_active ?? 1, req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/airlines/:id — soft delete
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE airlines SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
