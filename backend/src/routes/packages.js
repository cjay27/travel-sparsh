const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/packages — public
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, price, duration, destinations, image_url FROM packages WHERE is_active = 1 ORDER BY created_at DESC'
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
  body('price').isFloat({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { name, description, price, duration, destinations, image_url } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO packages (name, description, price, duration, destinations, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description || null, price, duration || null, destinations || null, image_url || null]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// PUT /api/packages/:id
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, description, price, duration, destinations, image_url, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE packages SET name=?, description=?, price=?, duration=?, destinations=?, image_url=?, is_active=? WHERE id=?',
      [name, description, price, duration, destinations, image_url, is_active ?? 1, req.params.id]
    );
    res.json({ success: true });
  } catch {
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
