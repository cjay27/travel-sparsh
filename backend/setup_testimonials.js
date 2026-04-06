const pool = require('./src/config/db');

const sql_testimonials = `
CREATE TABLE IF NOT EXISTS testimonials (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(255) NOT NULL,
  city              VARCHAR(100) DEFAULT NULL,
  rating            TINYINT UNSIGNED NOT NULL DEFAULT 5,
  content           TEXT NOT NULL,
  profile_image_url VARCHAR(500) DEFAULT NULL,
  is_active         TINYINT(1) NOT NULL DEFAULT 1,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
`;

async function setup() {
  try {
    console.log('Starting DB migration...');
    
    // Create testimonials
    await pool.query(sql_testimonials);
    console.log('✅ Testimonials table checked/created.');

    // Add sample data if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM testimonials');
    if (rows[0].count === 0) {
      await pool.query(`INSERT IGNORE INTO testimonials (name, city, rating, content) VALUES
        ('Priya Sharma', 'Delhi', 5, 'Saved ₹4,200 on my Mumbai round-trip. The expert was incredibly helpful and responsive. Best travel experience ever!'),
        ('Rahul Mehta', 'Bangalore', 5, "Booked 6 flights through Travel Sparsh this year. Every time, the price was unbeatable and the process was seamless."),
        ('Anjali Nair', 'Kochi', 5, 'Got a last-minute Goa deal that was ₹3,000 cheaper than anything I found online. Their team is absolutely brilliant.')`);
      console.log('✅ Sample testimonials seeded.');
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err);
    process.exit(1);
  }
}

setup();
