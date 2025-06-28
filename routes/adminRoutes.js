const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  getAdmins,
  updateAdminRole,
  logoutAdmin
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');
const sessionLock = require('../middlewares/sessionMiddleware');
const User = require('../models/User');

// 🔐 Apply Admin Protections
router.use(protect);
router.use(adminOnly);
router.use(sessionLock);

// 📦 Product Management
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// 👥 User Management
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

// 🧑‍💼 Admin Panel: List Admins
router.get('/admins', getAdmins);

// 🔄 Update Admin Role
router.put('/admins/:id/role', updateAdminRole);

// 🚪 Admin Logout (device logout)
router.post('/logout', logoutAdmin);

module.exports = router;
