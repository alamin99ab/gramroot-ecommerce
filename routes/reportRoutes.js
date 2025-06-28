const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getCoinReport,
  getUserReport
} = require('../controllers/reportController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const sessionLock = require('../middlewares/sessionMiddleware');

// 🔐 Admin access required
router.use(protect);
router.use(adminOnly);
router.use(sessionLock);

// 🧾 Reports
router.get('/sales', getSalesReport);
router.get('/coins', getCoinReport);
router.get('/users', getUserReport);

module.exports = router;
