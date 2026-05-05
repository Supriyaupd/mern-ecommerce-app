const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, restrictTo } = require('../middleware/auth');
const { productValidationRules, validate } = require('../middleware/validate');

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', protect, restrictTo('admin'), upload.single('image'), productValidationRules, validate, createProduct);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), validate, updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;