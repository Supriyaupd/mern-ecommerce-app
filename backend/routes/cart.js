const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

// GET /api/cart - Get user's cart
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product', 'name price image stock');
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock' });

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    await user.save();
    await user.populate('cart.product', 'name price image stock');
    res.json({ success: true, message: 'Added to cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cart/:productId - Update cart item quantity
router.put('/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === req.params.productId);

    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (quantity <= 0) {
      user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product', 'name price image stock');
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    await user.save();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
