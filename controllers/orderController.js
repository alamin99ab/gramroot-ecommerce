// controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

// 📦 Place Order
exports.placeOrder = async (req, res) => {
  const { items, address, paymentMethod, coinUsed } = req.body;

  const user = await User.findById(req.user._id);
  if (coinUsed > user.coins) return res.status(400).json({ message: "Not enough coins" });

  const order = await Order.create({
    user: req.user._id,
    items,
    address,
    paymentMethod,
    coinUsed,
    trackingId: 'TRK' + Date.now(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  });

  if (coinUsed > 0) {
    user.coins -= coinUsed;
    await user.save();
  }

  res.status(201).json({ message: "Order placed", orderId: order._id });
};

// 🚚 Track Order
exports.trackOrder = async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('items.productId');
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

// 📄 Order History
exports.orderHistory = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// 📄 Invoice PDF (dummy text for now)
exports.getInvoice = async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('items.productId');
  if (!order) return res.status(404).json({ message: "Order not found" });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text("GramRootFoods Invoice", { align: "center" });
  doc.moveDown();

  order.items.forEach((item, i) => {
    doc.fontSize(14).text(`${i + 1}. ${item.productId.name} x ${item.qty}`);
  });

  doc.text(`\nCoins Used: ${order.coinUsed}`);
  doc.text(`Payment: ${order.paymentMethod}`);
  doc.text(`Tracking ID: ${order.trackingId}`);
  doc.text(`Estimated Delivery: ${order.estimatedDelivery.toDateString()}`);

  doc.end();
};
