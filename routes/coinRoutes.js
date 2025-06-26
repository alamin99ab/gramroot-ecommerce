// routes/coinRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCoinDashboard,
  earnCoin,
  spendCoin
} = require('../controllers/coinController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getCoinDashboard);
router.post('/earn', protect, earnCoin);
router.post('/spend', protect, spendCoin);

module.exports = router;
