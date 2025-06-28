const User = require('../models/User');
const Order = require('../models/Order');

// GET All Admins (support/marketing included)
exports.getAdmins = async (req, res) => {
  const admins = await User.find({ role: { $in: ['support-admin', 'marketing-admin', 'product-admin'] } }).select('-password');
  res.json(admins);
};

// Promote to Role
exports.updateAdminRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = role;
  await user.save();
  res.json({ message: 'Role updated' });
};

// Admin logout → kill session
exports.logoutAdmin = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.activeSession = null;
  await user.save();
  res.json({ message: 'Logged out from device' });
};
