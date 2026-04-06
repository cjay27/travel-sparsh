const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sendEnquiryEmail } = require('../utils/mailer');
const { encrypt, decrypt } = require('../utils/crypto');


const router = express.Router();

// POST /api/contact — submit enquiry (public)
router.post('/',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const {
      name, email, phone, trip_type, from_city, to_city,
      departure_date, return_date, adults = 1, children = 0, infants = 0,
      cabin_class = 'Economy', message,
    } = req.body;

    try {
      const encryptedName = encrypt(name);
      const encryptedEmail = encrypt(email);
      const encryptedPhone = encrypt(phone);
      const encryptedMessage = encrypt(message);

      const [result] = await pool.query(
        `INSERT INTO contacts
         (name, email, phone, trip_type, from_city, to_city, departure_date,
          return_date, adults, children, infants, cabin_class, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [encryptedName, encryptedEmail, encryptedPhone, trip_type || null, from_city || null, to_city || null,
          departure_date || null, return_date || null,
          adults, children, infants, cabin_class, encryptedMessage || null]
      );


      // ── Send Email ───────────────────────────────────────────────
      // We pass the raw (unencrypted) data to the mailer
      try {
        await sendEnquiryEmail({
          name, email, phone, trip_type, from_city, to_city,
          adults, children, infants, message: message || 'No extra message'
        });
      } catch (err) {
        console.error('Mailer failed but DB saved:', err);
      }

      res.status(201).json({
        success: true,
        message: 'Enquiry submitted! Our expert will contact you within 30 minutes.',
        id: result.insertId,
      });
    } catch (err) {
      console.error('Contact DB Error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// POST /api/contact/subscribe — newsletter
router.post('/subscribe',
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
    try {
      await pool.query(
        'INSERT IGNORE INTO subscribers (email) VALUES (?)', [req.body.email]
      );
      res.json({ success: true, message: 'Subscribed successfully!' });
    } catch {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// GET /api/contact/my — get current user's enquiries
router.get('/my', authenticate, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM contacts WHERE email = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [encrypt(req.user.email), limit, offset]
    );

    const decryptedRows = rows.map(r => ({
      ...r,
      name: decrypt(r.name),
      email: decrypt(r.email),
      phone: decrypt(r.phone),
      message: decrypt(r.message)
    }));

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM contacts WHERE email = ?`, [encrypt(req.user.email)]
    );

    res.json({ success: true, data: decryptedRows, total, page, limit });
  } catch (err) {
    console.error('My Enquiries Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Admin routes ──

// GET /api/contact/admin/all
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let where = '';
  const params = [];
  if (status) { where = 'WHERE status = ?'; params.push(status); }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM contacts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const decryptedRows = rows.map(r => ({
      ...r,
      name: decrypt(r.name),
      email: decrypt(r.email),
      phone: decrypt(r.phone),
      message: decrypt(r.message)
    }));

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM contacts ${where}`, params
    );
    res.json({ success: true, data: decryptedRows, total, page, limit });

  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/contact/admin/:id/status
router.patch('/admin/:id/status', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'converted', 'closed'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });
  try {
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/contact/admin/:id
router.delete('/admin/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
