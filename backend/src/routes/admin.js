const express = require('express');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/stats — dashboard overview
router.get('/stats', async (_req, res) => {
  try {
    const [[{ totalUsers }]]       = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role='user'");
    const [[{ totalBookings }]]    = await pool.query("SELECT COUNT(*) AS totalBookings FROM bookings");
    const [[{ totalEnquiries }]]   = await pool.query("SELECT COUNT(*) AS totalEnquiries FROM contacts");
    const [[{ newEnquiries }]]     = await pool.query("SELECT COUNT(*) AS newEnquiries FROM contacts WHERE status='new'");
    const [[{ totalAirlines }]]    = await pool.query("SELECT COUNT(*) AS totalAirlines FROM airlines WHERE is_active=1");
    const [[{ totalAirports }]]    = await pool.query("SELECT COUNT(*) AS totalAirports FROM airports WHERE is_active=1");
    const [[{ confirmedRevenue }]] = await pool.query(
      "SELECT COALESCE(SUM(total_fare),0) AS confirmedRevenue FROM bookings WHERE status IN ('confirmed','completed')"
    );

    const [monthlyBookings] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
       FROM bookings WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month ORDER BY month`
    );

    const [recentEnquiries] = await pool.query(
      'SELECT id, name, phone, from_city, to_city, departure_date, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 10'
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalEnquiries,
        newEnquiries,
        totalAirlines,
        totalAirports,
        confirmedRevenue,
        monthlyBookings,
        recentEnquiries,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/admin/users — list all users with pagination
router.get('/users', async (req, res) => {
  const page   = parseInt(req.query.page)  || 1;
  const limit  = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : null;

  let where = "WHERE role = 'user'";
  const params = [];
  if (search) { where += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)'; params.push(search, search, search); }

  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, role, is_active, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users ${where}`, params);
    res.json({ success: true, data: rows, total, page, limit });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/admin/users/:id — toggle active / update role
router.patch('/users/:id', async (req, res) => {
  const { is_active, role } = req.body;
  const sets = [];
  const params = [];

  if (is_active !== undefined) { sets.push('is_active = ?'); params.push(is_active); }
  if (role !== undefined)      { sets.push('role = ?');      params.push(role);      }
  if (!sets.length) return res.status(400).json({ success: false, message: 'No fields to update' });

  params.push(req.params.id);
  try {
    await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id — soft delete
router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
