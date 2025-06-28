const express = require('express');
const router = express.Router();
const {
  getCoinSettings,
  updateCoinSettings
} = require('../controllers/coinController');

const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// ✅ Allow both super-admin and product-admin to access coin-settings
router.get('/coin-settings', protect, authorizeRoles('super-admin', 'product-admin'), getCoinSettings);
router.put('/coin-settings', protect, authorizeRoles('super-admin', 'product-admin'), updateCoinSettings);

module.exports = router;
