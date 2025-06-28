const express = require('express');
const router = express.Router();
const {
  placeOrder,
  trackOrder,
  trackOrderPublic, // ✅ public tracking
  orderHistory,
  getInvoice
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/track/:orderId', trackOrder);        // 🔐 internal
router.get('/track', trackOrderPublic);           // ✅ public via trackingId
router.get('/history', protect, orderHistory);
router.get('/invoice/:orderId', protect, getInvoice);

module.exports = router;
