const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Temporary seed route - DELETE AFTER USE
app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Product = require('./models/Product');
    const Order = require('./models/Order');

    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);

    const admin = await User.create({ name: 'Admin User', email: 'admin@shopmern.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Demo User', email: 'user@shopmern.com', password: 'user1234', role: 'user' });

    await Product.insertMany([
      { name: 'Classic Oxford Shirt', price: 64.99, description: 'Timeless Oxford cloth shirt in comfortable regular fit.', category: 'Clothing', stock: 200, createdBy: admin._id },
      { name: 'Premium Slim-Fit Chinos', price: 79.00, description: 'Crafted from stretch-twill fabric for all-day comfort.', category: 'Clothing', stock: 150, createdBy: admin._id },
      { name: 'Merino Wool Crew Sweater', price: 129.00, description: 'Luxuriously soft extra-fine merino wool from New Zealand.', category: 'Clothing', stock: 80, createdBy: admin._id },
      { name: 'Clean Code by Robert C. Martin', price: 38.99, description: 'A Handbook of Agile Software Craftsmanship.', category: 'Books', stock: 300, createdBy: admin._id },
      { name: 'Designing Data-Intensive Applications', price: 52.99, description: 'The big ideas behind reliable scalable systems.', category: 'Books', stock: 210, createdBy: admin._id },
      { name: 'The Pragmatic Programmer', price: 44.99, description: 'One of the most influential books in software development.', category: 'Books', stock: 175, createdBy: admin._id },
      { name: 'Nespresso Vertuo Pop Coffee Maker', price: 109.99, description: 'Brews 5 cup sizes with one-touch operation.', category: 'Home & Garden', stock: 60, createdBy: admin._id },
      { name: 'Philips Hue Starter Kit', price: 199.99, description: 'Control 16 million colors with your voice or phone.', category: 'Home & Garden', stock: 42, createdBy: admin._id },
      { name: 'Le Creuset Dutch Oven', price: 399.95, description: 'Enameled cast iron for even heat distribution.', category: 'Home & Garden', stock: 25, createdBy: admin._id },
      { name: 'Dyson Airwrap Complete Styler', price: 599.99, description: 'Styles and dries simultaneously using Coanda effect.', category: 'Beauty', stock: 15, createdBy: admin._id },
      { name: 'The Ordinary Hyaluronic Acid', price: 12.90, description: 'Multi-depth hydration for all skin types.', category: 'Beauty', stock: 500, createdBy: admin._id },
      { name: 'LEGO Technic Bugatti Bolide', price: 459.99, description: 'Build the iconic Bugatti Bolide racing car.', category: 'Toys', stock: 12, createdBy: admin._id },
    ]);

    res.json({ success: true, message: '🎉 Database seeded! 12 products and 2 users created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-Commerce API is running' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Database & Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
