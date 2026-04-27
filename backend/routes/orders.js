const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// POST /api/orders - Place order from cart
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user.cart.length) return res.status(400).json({ success: false, message: 'Cart is empty' });

    const items = [];
    let totalAmount = 0;

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      items.push({ product: product._id, name: product.name, price: product.price, quantity: cartItem.quantity });
      totalAmount += product.price * cartItem.quantity;

      // Decrement stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -cartItem.quantity } });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress: req.body.shippingAddress,
    });

    // Clear cart
    user.cart = [];
    await user.save();

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders - Get current user's orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/all - Admin: get all orders
router.get('/all', restrictTo('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status - Admin: update order status
router.put('/:id/status', restrictTo('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
