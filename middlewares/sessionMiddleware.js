const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sessionLock = async (req, res, next) => {
  try {
    if (!req.user || !req.user.role.includes('admin')) return next();

    const token = req.headers.authorization?.split(' ')[1];
    const user = await User.findById(req.user._id);

    // Check if user has a saved session token
    if (
      !user.activeSession ||
      user.activeSession.token !== token
    ) {
      return res.status(401).json({ message: 'Session expired or logged in from another device' });
    }

    next();
  } catch (err) {
    console.error('Session middleware error:', err.message);
    res.status(500).json({ message: 'Session validation failed' });
  }
};

module.exports = sessionLock;
