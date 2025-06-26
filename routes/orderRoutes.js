// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  placeOrder,
  trackOrder,
  orderHistory,
  getInvoice
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/track/:orderId', trackOrder);
router.get('/history', protect, orderHistory);
router.get('/invoice/:orderId', protect, getInvoice);

module.exports = router;
