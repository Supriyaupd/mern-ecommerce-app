
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const ADMIN = {
  name: 'Admin User',
  email: 'admin@shopmern.com',
  password: 'admin123',
  role: 'admin',
};

const PRODUCTS = [
  // Clothing
  {
    name: 'Classic Oxford Button-Down Shirt',
    price: 64.99,
    description: 'Timeless Oxford cloth shirt in a comfortable regular fit. Made from 100% combed cotton with a wrinkle-resistant finish. Machine washable and available in 8 colors.',
    category: 'Clothing',
    stock: 200,
  },
  {
    name: 'Premium Slim-Fit Chinos',
    price: 79.00,
    description: 'Crafted from stretch-twill fabric for all-day comfort. Slim through the hip and thigh with a tapered leg. Features a hidden elastic waistband and four-way stretch.',
    category: 'Clothing',
    stock: 150,
  },
  {
    name: 'Merino Wool Crew Sweater',
    price: 129.00,
    description: 'Luxuriously soft extra-fine merino wool from New Zealand. Naturally temperature-regulating and odor-resistant. Ribbed collar, cuffs, and hem for a polished finish.',
    category: 'Clothing',
    stock: 80,
  },

  // Books
  {
    name: 'Clean Code by Robert C. Martin',
    price: 38.99,
    description: 'A Handbook of Agile Software Craftsmanship. Packed with real-world examples and step-by-step practice exercises, this book will help you write better, more maintainable code.',
    category: 'Books',
    stock: 300,
  },
  {
    name: 'Designing Data-Intensive Applications',
    price: 52.99,
    description: 'The big ideas behind reliable, scalable, and maintainable systems. Covers databases, distributed systems, data models, encoding formats, and more.',
    category: 'Books',
    stock: 210,
  },
  {
    name: 'The Pragmatic Programmer (20th Anniversary)',
    price: 44.99,
    description: 'One of the most influential books in software development, updated for the modern era. Covers topics from career development to architectural techniques that help you stay effective.',
    category: 'Books',
    stock: 175,
  },

  // Home & Garden
  {
    name: 'Nespresso Vertuo Pop Coffee Maker',
    price: 109.99,
    description: 'Brews 5 cup sizes from espresso to alto with Centrifusion™ technology. One-touch operation with 30-second heat-up. Includes a complimentary starter capsule kit.',
    category: 'Home & Garden',
    stock: 60,
  },
  {
    name: 'Philips Hue Starter Kit (4 Bulbs)',
    price: 199.99,
    description: 'Control 16 million colors and shades of white with your voice or phone. Includes 4 A19 color bulbs and Hue Bridge. Works with Alexa, Google Assistant, and Apple HomeKit.',
    category: 'Home & Garden',
    stock: 42,
  },
  {
    name: 'Le Creuset 5.5 Qt Dutch Oven',
    price: 399.95,
    description: 'Enameled cast iron for even heat distribution and retention. Tight-fitting lid seals in moisture for perfect braises and stews. Dishwasher safe with a lifetime guarantee.',
    category: 'Home & Garden',
    stock: 25,
    },

  // Beauty
  {
    name: 'Dyson Airwrap Complete Styler',
    price: 599.99,
    description: 'Styles and dries simultaneously using the Coanda effect. Multiple attachments for waves, curls, and smooth styles. Intelligent heat control prevents extreme heat damage.',
    category: 'Beauty',
    stock: 15,
  },
  {
    name: 'The Ordinary Hyaluronic Acid 2% + B5',
    price: 12.90,
    description: 'Multi-depth hydration formula with 2% hyaluronic acid crosspolymer. Vitamin B5 supports surface hydration. Lightweight, non-greasy texture suitable for all skin types.',
    category: 'Beauty',
    stock: 500,
  },

  // Toys
  {
    name: 'LEGO Technic Bugatti Bolide (3,438 pcs)',
    price: 459.99,
    description: 'Build the iconic Bugatti Bolide racing car with a detailed W16 engine, steering function, and aerodynamic body. Suitable for ages 18+. Includes display stand.',
    category: 'Toys',
    stock: 12,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing data');

    // Create admin user
    const admin = await User.create(ADMIN);
    console.log(`👤 Admin created: ${admin.email} / admin123`);

    // Create products
    const products = await Product.insertMany(
      PRODUCTS.map((p) => ({ ...p, createdBy: admin._id }))
    );
    console.log(`📦 Inserted ${products.length} products`);

    // Create a demo regular user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'user@shopmern.com',
      password: 'user1234',
      role: 'user',
    });
    console.log(`👤 Demo user created: ${demoUser.email} / user1234`);

    console.log('\n🎉 Seeding complete!\n');
    console.log('─────────────────────────────────');
    console.log('Admin login:  admin@shopmern.com  /  admin123');
    console.log('User login:   user@shopmern.com   /  user1234');
    console.log('─────────────────────────────────\n');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
