const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const checkDevice = require('../middlewares/deviceCheck');

// Test Admin Route
router.get('/dashboard',
  protect,
  checkDevice,
  authorizeRoles('super-admin'),
  (req, res) => {
    res.send('Welcome to Super Admin Dashboard');
  }
);

module.exports = router;
