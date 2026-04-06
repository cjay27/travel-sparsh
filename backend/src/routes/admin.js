const express = require('express');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const { authenticate, requireAdmin } = require('../middleware/auth');
const { decrypt } = require('../utils/crypto');


const router = express.Router();

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/stats — dashboard overview
router.get('/stats', async (_req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role='user'");
    const [[{ totalEnquiries }]] = await pool.query("SELECT COUNT(*) AS totalEnquiries FROM contacts");
    const [[{ newEnquiries }]] = await pool.query("SELECT COUNT(*) AS newEnquiries FROM contacts WHERE status='new'");
    const [[{ totalAirlines }]] = await pool.query("SELECT COUNT(*) AS totalAirlines FROM airlines WHERE is_active=1");
    const [[{ totalAirports }]] = await pool.query("SELECT COUNT(*) AS totalAirports FROM airports WHERE is_active=1");
    const [[{ totalPackages }]] = await pool.query("SELECT COUNT(*) AS totalPackages FROM packages WHERE status='active'");

    const [recentEnquiriesRaw] = await pool.query(
      "SELECT id as _id, name, phone, from_city, to_city, DATE_FORMAT(departure_date, '%Y-%m-%d') as departure_date, status, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at FROM contacts ORDER BY created_at DESC LIMIT 10"
    );

    const recentEnquiries = recentEnquiriesRaw.map(e => ({
      ...e,
      name: decrypt(e.name),
      phone: decrypt(e.phone)
    }));


    const [topRoutes] = await pool.query(
      `SELECT CONCAT(IFNULL(from_city, 'Unknown'), ' → ', IFNULL(to_city, 'Unknown')) as route, COUNT(*) as count 
       FROM contacts
       WHERE from_city IS NOT NULL AND to_city IS NOT NULL
       GROUP BY 1 ORDER BY count DESC LIMIT 6`
    );

    let maxCount = topRoutes.length > 0 ? topRoutes[0].count : 1;
    const formattedTopRoutes = topRoutes.map(r => ({
      route: r.route,
      count: r.count,
      pct: Math.round((r.count / maxCount) * 100)
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalEnquiries,
        newEnquiries,
        totalAirlines,
        totalAirports,
        totalPackages,
        recentEnquiries,
        topRoutes: formattedTopRoutes,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /api/admin/users — list all users with pagination
router.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : null;

  let where = "WHERE u.role = 'user'";
  const params = [];
  if (search) {
    where += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
    params.push(search, search, search);
  }

  try {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.role, 
        IF(u.is_active=1, 'active', 'inactive') as status,
        DATE_FORMAT(u.created_at, '%Y-%m-%d') as joined,
        (SELECT COUNT(*) FROM contacts c WHERE c.email = u.email) as enquiries
      FROM users u
      ${where}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [...params, limit, offset]);
    const formattedRows = rows;

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users u ${where}`, params);
    res.json({ success: true, data: formattedRows, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/admin/users/:id — toggle active / update role
router.patch('/users/:id', async (req, res) => {
  const { is_active, role } = req.body;
  const sets = [];
  const params = [];

  if (is_active !== undefined) { sets.push('is_active = ?'); params.push(is_active); }
  if (role !== undefined) { sets.push('role = ?'); params.push(role); }
  if (!sets.length) return res.status(400).json({ success: false, message: 'No fields to update' });

  params.push(req.params.id);
  try {
    await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Admin Users CRUD ──────────────────────────────────────────

// GET /api/admin/admins — list all admin accounts
router.get('/admins', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role, is_active, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at FROM users WHERE role = 'admin' ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/admins — create new admin
router.post('/admins', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'admin')",
      [name, email, phone || null, hashedPassword]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/admins/:id — delete admin
router.delete('/admins/:id', async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }
    await pool.query('DELETE FROM users WHERE id = ? AND role = "admin"', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

