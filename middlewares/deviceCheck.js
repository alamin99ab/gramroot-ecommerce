// middlewares/deviceCheck.js

const User = require('../models/User');

async function checkDevice(req, res, next) {
  const userId = req.user.id;
  const currentDevice = req.headers['x-device-id']; // frontend থেকে পাঠাবে

  try {
    const user = await User.findById(userId);

    if (user.role === 'super-admin') {
      if (user.currentDevice && user.currentDevice !== currentDevice) {
        return res.status(403).json({ message: 'Another device is already logged in.' });
      }

      // If first login or new device
      if (!user.currentDevice) {
        user.currentDevice = currentDevice;
        await user.save();
      }
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Device check failed' });
  }
}

module.exports = checkDevice;
