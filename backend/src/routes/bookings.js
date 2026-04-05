const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Generate PNR
const genPNR = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// GET /api/bookings/my — user's own bookings
router.get('/my', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, pnr, trip_type, from_city, to_city, departure_date, return_date,
              airline, cabin_class, adults, children, infants, total_fare, status, created_at
       FROM bookings WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/bookings/pnr/:pnr — public PNR check
router.get('/pnr/:pnr', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.pnr, b.trip_type, b.from_city, b.to_city, b.departure_date,
              b.return_date, b.airline, b.cabin_class, b.adults, b.children, b.infants,
              b.total_fare, b.status, b.created_at, u.name AS passenger_name
       FROM bookings b JOIN users u ON b.user_id = u.id
       WHERE b.pnr = ?`,
      [req.params.pnr.toUpperCase()]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'PNR not found' });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/bookings — create booking
router.post('/', authenticate,
  body('trip_type').isIn(['one-way', 'round-trip', 'multi-city']),
  body('from_city').trim().notEmpty(),
  body('to_city').trim().notEmpty(),
  body('departure_date').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const {
      trip_type, from_city, to_city, departure_date, return_date,
      airline, cabin_class = 'Economy', adults = 1, children = 0, infants = 0, total_fare = 0,
    } = req.body;

    let pnr;
    let attempts = 0;
    while (attempts < 5) {
      pnr = genPNR();
      const [ex] = await pool.query('SELECT id FROM bookings WHERE pnr = ?', [pnr]);
      if (!ex.length) break;
      attempts++;
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO bookings
         (user_id, pnr, trip_type, from_city, to_city, departure_date, return_date,
          airline, cabin_class, adults, children, infants, total_fare)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, pnr, trip_type, from_city, to_city, departure_date,
         return_date || null, airline || null, cabin_class, adults, children, infants, total_fare]
      );
      res.status(201).json({ success: true, id: result.insertId, pnr });
    } catch {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, status FROM bookings WHERE id = ?', [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Booking not found' });

    const booking = rows[0];
    if (booking.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Forbidden' });

    if (booking.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Already cancelled' });

    await pool.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Admin routes ──

// GET /api/bookings/admin/all
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let where = '';
  const params = [];
  if (status) { where = 'WHERE b.status = ?'; params.push(status); }

  try {
    const [rows] = await pool.query(
      `SELECT b.*, u.name AS user_name, u.email AS user_email
       FROM bookings b JOIN users u ON b.user_id = u.id
       ${where} ORDER BY b.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM bookings b ${where}`, params
    );
    res.json({ success: true, data: rows, total, page, limit });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/bookings/admin/:id/status
router.patch('/admin/:id/status', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['pending','confirmed','cancelled','completed'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });
  try {
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
