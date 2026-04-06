const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

// POST /api/auth/register
router.post('/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian phone required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const { name, email, phone, password } = req.body;
    try {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length)
        return res.status(409).json({ success: false, message: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
        [name, email, phone, hashed]
      );

      const token = signToken(result.insertId);
      res.status(201).json({
        success: true,
        token,
        user: { id: result.insertId, name, email, phone, role: 'user' },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, phone, role, password, is_active FROM users WHERE email = ?',
        [email]
      );

      if (!rows.length || !(await bcrypt.compare(password, rows[0].password)))
        return res.status(401).json({ success: false, message: 'Invalid email or password' });

      if (!rows[0].is_active)
        return res.status(403).json({ success: false, message: 'Account is deactivated' });

      const { password: _, ...user } = rows[0];
      const token = signToken(user.id);
      res.json({ success: true, token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/logout
router.post('/logout', authenticate, (_req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
