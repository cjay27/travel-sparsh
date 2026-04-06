const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/packages — public
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM packages WHERE is_active = 1 AND status = 'active' ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/packages/:id — public
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM packages WHERE id = ? AND is_active = 1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/packages/admin/all
router.get('/admin/all', authenticate, requireAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM packages ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/packages
router.post('/', authenticate, requireAdmin,
  body('name').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { name, minPrice, maxPrice, duration, destination, includes, type, status } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO packages (name, price, max_price, duration, destinations, includes, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, minPrice || 0, maxPrice || 0, duration || null, destination || null, includes || null, type || 'Leisure', status || 'active']
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch(err) {
      console.error(err)
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// PUT /api/packages/:id
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, minPrice, maxPrice, duration, destination, includes, type, status } = req.body;
  try {
    await pool.query(
      'UPDATE packages SET name=?, price=?, max_price=?, duration=?, destinations=?, includes=?, type=?, status=? WHERE id=?',
      [name, minPrice || 0, maxPrice || 0, duration, destination, includes, type, status, req.params.id]
    );
    res.json({ success: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/packages/:id — soft
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE packages SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
