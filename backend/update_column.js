const pool = require('./src/config/db');

async function update() {
  try {
    console.log('Updating profile_image_url to support Base64...');
    await pool.query("ALTER TABLE testimonials MODIFY profile_image_url LONGTEXT;");
    console.log('✅ Column modified to LONGTEXT.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Update failed:', err);
    process.exit(1);
  }
}

update();
