// models/CoinSettings.js

const mongoose = require('mongoose');

const coinSettingsSchema = new mongoose.Schema({
  adCoinEnabled: { type: Boolean, default: true },
  adCoinValue: { type: Number, default: 5 },

  referralEnabled: { type: Boolean, default: true },
  referralCoinValue: { type: Number, default: 10 },

  loginBonusEnabled: { type: Boolean, default: true },
  loginBonusCoinValue: { type: Number, default: 3 },

  coinToTakaRate: { type: Number, default: 1 },

  maxCoinDiscountPercent: { type: Number, default: 30 },

  mysteryBoxEnabled: { type: Boolean, default: true },
  mysteryBoxMin: { type: Number, default: 1 },
  mysteryBoxMax: { type: Number, default: 10 }
});

module.exports = mongoose.model('CoinSettings', coinSettingsSchema);
