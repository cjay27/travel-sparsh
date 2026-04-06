const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// ── Public Subscriber Route ──────────────────────────────────────────────
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ status: 'error', message: 'Valid email required' });
  }

  try {
    // Check if already exists
    const [existing] = await pool.query('SELECT id FROM newsletter_subs WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(200).json({ status: 'success', message: 'You are already subscribed!' });
    }

    // Insert new
    await pool.query('INSERT INTO newsletter_subs (email) VALUES (?)', [email]);
    res.status(201).json({ status: 'success', message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Newsletter Subscribe error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// ── Admin Routes ──────────────────────────────────────────────────────────
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT id, email, status, created_at FROM newsletter_subs';
    let countQuery = 'SELECT COUNT(*) as total FROM newsletter_subs';
    let params = [];
    let countParams = [];

    if (search) {
      const filter = `%${search}%`;
      query += ' WHERE email LIKE ?';
      countQuery += ' WHERE email LIKE ?';
      params.push(filter);
      countParams.push(filter);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    const [count] = await pool.query(countQuery, countParams);

    res.json({
      status: 'success',
      data: rows,
      total: count[0].total,
      pages: Math.ceil(count[0].total / limit)
    });
  } catch (err) {
    console.error('Newsletter Fetch error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch subscribers' });
  }
});

// Update status (e.g. Unsubscribe)
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['active', 'unsubscribed'].includes(status)) {
    return res.status(400).json({ status: 'error', message: 'Invalid status' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE newsletter_subs SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Not found' });
    res.json({ status: 'success', message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Update failed' });
  }
});

// Delete subscriber
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM newsletter_subs WHERE id = ?', [req.params.id]);
    res.json({ status: 'success', message: 'Subscriber removed' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Delete failed' });
  }
});

module.exports = router;
