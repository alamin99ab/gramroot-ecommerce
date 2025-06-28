const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { saveLogoutLog, getLogoutLogs } = require('../controllers/logoutController');

// ইউজার logout log save করবে নিজে logout করলে
router.post('/logout', protect, saveLogoutLog);

// admin সব logout logs দেখতে পারবে
router.get('/logout/logs', protect, adminOnly, getLogoutLogs);

module.exports = router;
