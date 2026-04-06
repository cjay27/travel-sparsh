const pool = require('./src/config/db');

const testimonials = [
  { name: 'Priya Sharma', city: 'Delhi', rating: 5, content: 'Saved ₹4,200 on my Mumbai round-trip. The expert was incredibly helpful and responsive. Best travel experience ever!', profile_image_url: null },
  { name: 'Rahul Mehta', city: 'Bangalore', rating: 5, content: "Booked 6 flights through Travel Sparsh this year. Every time, the price was unbeatable and the process was seamless.", profile_image_url: null },
  { name: 'Anjali Nair', city: 'Kochi', rating: 5, content: 'Got a last-minute Goa deal that was ₹3,000 cheaper than anything I found online. Their team is absolutely brilliant.', profile_image_url: null }
];

async function seed() {
  try {
    for (const t of testimonials) {
      await pool.query(
        "INSERT INTO testimonials (name, city, rating, content, profile_image_url) VALUES (?, ?, ?, ?, ?)",
        [t.name, t.city, t.rating, t.content, t.profile_image_url]
      );
    }
    console.log('Testimonials seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
