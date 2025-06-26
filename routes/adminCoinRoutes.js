const express = require('express');
const router = express.Router();
const {
  getCoinSettings,
  updateCoinSettings
} = require('../controllers/coinController');

const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// Routes
router.get('/coin-settings', protect, authorizeRoles('super-admin'), getCoinSettings);
router.put('/coin-settings', protect, authorizeRoles('super-admin'), updateCoinSettings);

module.exports = router;
