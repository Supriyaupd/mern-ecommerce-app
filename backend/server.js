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
  { name: 'Dhaka Topi', price: 850, description: 'Traditional Nepali cap made from Dhaka fabric. Perfect for festivals and cultural events.', category: 'Clothing', stock: 100, image: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=500&q=80', createdBy: admin._id },
  { name: 'Pashmina Shawl', price: 2500, description: 'Luxurious pure pashmina shawl from the hills of Nepal. Extremely soft and warm.', category: 'Clothing', stock: 50, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80', createdBy: admin._id },
  { name: 'Yak Wool Sweater', price: 3500, description: 'Handknitted yak wool sweater from Mustang. Extremely warm and durable.', category: 'Clothing', stock: 30, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80', createdBy: admin._id },
  { name: 'Nepali Dhaka Kurta', price: 1800, description: 'Beautiful handwoven Dhaka fabric kurta. Traditional Nepali design with modern fit.', category: 'Clothing', stock: 60, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80', createdBy: admin._id },
  { name: 'Himalayan Honey 1kg', price: 800, description: 'Pure organic honey collected from the Himalayan mountains. Rich in antioxidants.', category: 'Food & Grocery', stock: 150, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500&q=80', createdBy: admin._id },
  { name: 'Nepali Ilam Tea 500g', price: 450, description: 'Premium first flush tea from the gardens of Ilam. Rich aroma and smooth taste.', category: 'Food & Grocery', stock: 200, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&q=80', createdBy: admin._id },
  { name: 'Timur Nepali Pepper 100g', price: 250, description: 'Authentic Nepali Timur from the hills of Nepal. Perfect for traditional Nepali cooking.', category: 'Food & Grocery', stock: 300, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80', createdBy: admin._id },
  { name: 'Singing Bowl Medium', price: 1200, description: 'Handcrafted seven metal singing bowl from Bhaktapur. Perfect for meditation.', category: 'Home & Garden', stock: 40, image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500&q=80', createdBy: admin._id },
  { name: 'Thangka Painting', price: 5000, description: 'Hand painted traditional Thangka painting on cotton canvas. Perfect for home decoration.', category: 'Home & Garden', stock: 20, image: 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=500&q=80', createdBy: admin._id },
  { name: 'Nepali Wool Carpet 3x5 ft', price: 8500, description: 'Handwoven pure wool carpet from Kathmandu. Traditional Tibetan design with natural dyes.', category: 'Home & Garden', stock: 10, image: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=500&q=80', createdBy: admin._id },
  { name: 'Mithila Art Painting', price: 3500, description: 'Traditional Mithila art painting from Janakpur. Hand painted by local women artists.', category: 'Home & Garden', stock: 15, image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=500&q=80', createdBy: admin._id },
  { name: 'Lokta Paper Journal', price: 350, description: 'Handmade journal using traditional Lokta paper from Nepal. Eco-friendly and durable.', category: 'Books', stock: 150, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80', createdBy: admin._id },
  { name: 'Rudraksha Mala 108 beads', price: 950, description: 'Authentic Rudraksha mala from the hills of Nepal. Perfect for meditation.', category: 'Beauty', stock: 80, image: 'https://images.unsplash.com/photo-1628191013085-990d39ec25e0?w=500&q=80', createdBy: admin._id },
  { name: 'Nepali Incense Sticks', price: 180, description: 'Traditional Nepali herbal incense sticks. Long lasting fragrance. Perfect for meditation.', category: 'Beauty', stock: 500, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80', createdBy: admin._id },
  { name: 'LEGO Classic Set', price: 2200, description: 'Classic LEGO building set with 500 pieces. Perfect for kids of all ages.', category: 'Toys', stock: 25, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80', createdBy: admin._id },
]);
    res.json({ success: true, message: '🎉 Nepali products seeded with images!' });
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
