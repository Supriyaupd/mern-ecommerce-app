const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, restrictTo } = require('../middleware/auth');
const { productValidationRules, validate } = require('../middleware/validate');

// ─── Multer Setup for Image Uploads ───────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── Public Routes ────────────────────────────────────────────────────────────
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// ─── Admin-Only Routes ────────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  productValidationRules,
  validate,
  createProduct
);

router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  validate,
  updateProduct
);

router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
