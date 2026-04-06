const pool = require('./src/config/db');

async function check() {
  try {
    const [rows] = await pool.query("SHOW TABLES LIKE 'testimonials'");
    if (rows.length === 0) {
      console.log('Testimonials table NOT found!');
    } else {
      console.log('Testimonials table exists.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
}

check();
