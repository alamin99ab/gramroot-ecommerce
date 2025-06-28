const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: null },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['super-admin', 'product-admin', 'support-admin', 'marketing-admin'],
    default: 'product-admin'
  },

  currentDevice: { type: String, default: null },
  coins: { type: Number, default: 0 },

  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },

  referredBy: { type: String, default: null },

  activeSession: {
    token: { type: String },
    userAgent: String,
    ip: String,
    loginAt: Date
  },

  otpCode: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },

  registrationIP: String
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);