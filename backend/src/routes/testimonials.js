const express = require('express');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/testimonials — fetch active testimonials (Public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, city, rating, content, profile_image_url FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Admin routes ──
router.use(authenticate, requireAdmin);

// GET /api/testimonials/admin/all — list all testimonials
router.get('/admin/all', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, city, rating, content, profile_image_url, is_active, DATE_FORMAT(created_at, '%Y-%m-%d') as joined FROM testimonials ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/testimonials — create
router.post('/', async (req, res) => {
  const { name, city, rating, content, profile_image_url } = req.body;
  if (!name || !content) return res.status(400).json({ success: false, message: 'Missing name or content' });

  try {
    const [result] = await pool.query(
      "INSERT INTO testimonials (name, city, rating, content, profile_image_url) VALUES (?, ?, ?, ?, ?)",
      [name, city || null, rating || 5, content, profile_image_url || null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/testimonials/:id — update
router.put('/:id', async (req, res) => {
  const { name, city, rating, content, profile_image_url, is_active } = req.body;
  
  try {
    await pool.query(
      "UPDATE testimonials SET name=?, city=?, rating=?, content=?, profile_image_url=?, is_active=? WHERE id=?",
      [name, city, rating, content, profile_image_url, is_active, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/testimonials/:id — delete
router.delete('/:id', async (req, res) => {
  try {
    await pool.query("DELETE FROM testimonials WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
