const mongoose = require('mongoose');

const logoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  device: String,
  ip: String,
  loggedOutAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LogoutLog', logoutLogSchema);
