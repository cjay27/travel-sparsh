const db = require('./src/config/db');

const INIT = [
  { name: 'Goa Beach Holiday', description: 'Includes: Flight, Hotel, Transfers', type: 'Family', destinations: 'Goa', duration: '5D/4N', price: 35000, maxPrice: 55000, status: 'active', image_url: '' },
  { name: 'Royal Rajasthan', description: 'Includes: Flight, Hotel, Guided Tours', type: 'Leisure', destinations: 'Jaipur, Jodhpur, Udaipur', duration: '7D/6N', price: 52000, maxPrice: 85000, status: 'active', image_url: '' },
  { name: 'Kashmir Honeymoon', description: 'Includes: Flight, Houseboat, Hotel, Shikara', type: 'Honeymoon', destinations: 'Srinagar, Gulmarg', duration: '6D/5N', price: 65000, maxPrice: 1100000, status: 'active', image_url: '' },
  { name: 'Kerala Backwaters', description: 'Includes: Flight, Hotel, Houseboat, Transfers', type: 'Leisure', destinations: 'Kochi, Munnar, Alleppey', duration: '6D/5N', price: 42000, maxPrice: 70000, status: 'active', image_url: '' },
  { name: 'Corporate Bangalore', description: 'Includes: Flight, Business Hotel, Airport Transfer', type: 'Corporate', destinations: 'Bangalore', duration: '3D/2N', price: 18000, maxPrice: 30000, status: 'active', image_url: '' },
  { name: 'Andaman Adventure', description: 'Includes: Flight, Hotel, Water Sports, Tours', type: 'Adventure', destinations: 'Port Blair, Havelock', duration: '7D/6N', price: 58000, maxPrice: 95000, status: 'active', image_url: '' },
  { name: 'Manali Snow Trip', description: 'Includes: Flight, Hotel, Activities, Transfers', type: 'Adventure', destinations: 'Manali, Solang Valley', duration: '5D/4N', price: 28000, maxPrice: 45000, status: 'active', image_url: '' },
  { name: 'Family Mysore Pack', description: 'Includes: Flight, Hotel, Park Entry, Transfers', type: 'Family', destinations: 'Mysore, Coorg', duration: '4D/3N', price: 24000, maxPrice: 38000, status: 'inactive', image_url: '' },
  { name: 'Luxury Maldives', description: 'Includes: Flight, Water Villa, All-inclusive, Transfers', type: 'Honeymoon', destinations: 'Maldives', duration: '5D/4N', price: 120000, maxPrice: 200000, status: 'active', image_url: '' },
  { name: 'Delhi Heritage Tour', description: 'Includes: Flight, Hotel, Guided Tours, Entry Tickets', type: 'Leisure', destinations: 'Delhi, Agra', duration: '4D/3N', price: 22000, maxPrice: 35000, status: 'inactive', image_url: '' },
  { name: 'Sikkim Valley Trek', description: 'Includes: Flight, Hotel, Trek Guide, Permits', type: 'Adventure', destinations: 'Gangtok, Pelling', duration: '6D/5N', price: 32000, maxPrice: 55000, status: 'active', image_url: '' },
  { name: 'Corporate Chennai', description: 'Includes: Flight, Business Hotel, Transfer', type: 'Corporate', destinations: 'Chennai', duration: '2D/1N', price: 12000, maxPrice: 20000, status: 'active', image_url: '' },
];

(async () => {
    try {
        for (const p of INIT) {
            await db.execute(
                'INSERT IGNORE INTO packages (name, description, price, duration, destinations, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.name, p.description, p.price, p.duration, p.destinations, p.image_url, p.status === 'active' ? 1 : 0]
            );
        }
        console.log('Packages successfully seeded.');
    } catch (err) {
        console.error('Error seeding packages:', err);
    } finally {
        process.exit();
    }
})();
