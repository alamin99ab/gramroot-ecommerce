const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Admin Middleware Apply Globally
router.use(protect);
router.use(adminOnly);

// Product
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.put('/users/:id/ban', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isBanned = true;
  await user.save();
  res.json({ message: "User banned" });
});

module.exports = router;
