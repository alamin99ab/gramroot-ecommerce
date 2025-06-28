const LogoutLog = require('../models/LogoutLog');

// লগআউট লগ সেভ করা
exports.saveLogoutLog = async (req, res) => {
  try {
    await LogoutLog.create({
      userId: req.user._id,
      device: req.user.currentDevice,
      ip: req.ip || req.connection.remoteAddress
    });
    res.json({ message: 'Logout log saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save logout log', error: err.message });
  }
};

// সব লগআউট লগ দেখানো (admin only)
exports.getLogoutLogs = async (req, res) => {
  try {
    const logs = await LogoutLog.find().populate('userId', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logout logs', error: err.message });
  }
};
