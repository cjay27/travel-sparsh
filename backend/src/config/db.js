const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT) || 3306,
  database:           process.env.DB_NAME     || 'travel_sparsh',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:    20,
  queueLimit:         0,
  timezone:           '+05:30',
  charset:            'utf8mb4',
});

pool.getConnection()
  .then(conn => { conn.release(); console.log('✅ MySQL connected'); })
  .catch(err => { console.error('❌ MySQL connection error:', err.message); });

module.exports = pool;
