const Order = require('../models/Order');
const User = require('../models/User');

// 🧾 মোট অর্ডার সংখ্যা এবং টোটাল কয়েন ইউজড
exports.getSalesReport = async (req, res) => {
  const orders = await Order.find({ isPaid: true });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.items.reduce((p, i) => p + (i.qty * (i.productId?.price || 0)), 0), 0);
  const totalCoinUsed = orders.reduce((sum, o) => sum + (o.coinUsed || 0), 0);

  res.json({
    totalOrders,
    totalRevenue,
    totalCoinUsed
  });
};

// 🪙 কয়েন রিপোর্ট
exports.getCoinReport = async (req, res) => {
  const users = await User.find();
  const totalCoins = users.reduce((sum, u) => sum + (u.coins || 0), 0);

  res.json({
    userCount: users.length,
    totalCoins
  });
};

// 👥 ইউজার রিপোর্ট
exports.getUserReport = async (req, res) => {
  const userCount = await User.countDocuments();
  const adminCount = await User.countDocuments({ role: /admin/ });

  res.json({
    userCount,
    adminCount
  });
};
