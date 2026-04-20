require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Pepper = require('./models/Pepper');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // --- Seed admin user ---
  let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!admin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    admin = await User.create({
      fullName: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
    });
    console.log(`Admin seeded: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log('Admin already exists — skipping');
  }

  // --- Seed sample peppers ---
  const pepperCount = await Pepper.countDocuments();
  if (pepperCount === 0) {
    await Pepper.insertMany([
      {
        name: 'Bell Pepper',
        description: 'A sweet, mild pepper with a crisp texture. Available in red, yellow, green, and orange. Extremely versatile in cooking and eaten raw.',
        origin: 'Central America',
        color: 'Red / Yellow / Green',
        scoville: '0 SHU',
        heatLevel: 'None',
        createdBy: admin._id,
      },
      {
        name: 'Jalapeño',
        description: 'One of the most popular hot peppers in the world. Medium heat with a bright, grassy flavor. Widely used in Mexican cuisine.',
        origin: 'Mexico',
        color: 'Green / Red (when ripe)',
        scoville: '2,500–8,000 SHU',
        heatLevel: 'Medium',
        createdBy: admin._id,
      },
      {
        name: 'Habanero',
        description: 'Intensely hot with a fruity, citrusy flavor. A staple in Caribbean and Latin American cooking. Handle with care!',
        origin: 'Amazon Basin',
        color: 'Orange / Red',
        scoville: '100,000–350,000 SHU',
        heatLevel: 'Very Hot',
        createdBy: admin._id,
      },
      {
        name: 'Ghost Pepper (Bhut Jolokia)',
        description: 'Once the world\'s hottest pepper. Extreme heat with a smoky, fruity undertone. Used in very small quantities as a seasoning.',
        origin: 'India (Assam)',
        color: 'Red / Orange',
        scoville: '800,000–1,041,427 SHU',
        heatLevel: 'Extreme',
        createdBy: admin._id,
      },
      {
        name: 'Serrano',
        description: 'Hotter than jalapeño but with a similar bright flavor. Great for fresh salsas and sauces. Commonly used in Mexican and Thai cuisines.',
        origin: 'Mexico',
        color: 'Green / Red',
        scoville: '10,000–23,000 SHU',
        heatLevel: 'Hot',
        createdBy: admin._id,
      },
      {
        name: 'Anaheim',
        description: 'A mild, elongated green pepper popular in Southwestern US cuisine. Perfect for stuffing, roasting, and making chile verde.',
        origin: 'United States (California)',
        color: 'Green / Red',
        scoville: '500–2,500 SHU',
        heatLevel: 'Mild',
        createdBy: admin._id,
      },
    ]);
    console.log('6 sample peppers seeded');
  } else {
    console.log('Peppers already exist — skipping');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
