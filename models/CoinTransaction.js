// models/CoinTransaction.js
const mongoose = require('mongoose');

const coinTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['earn', 'spend'], required: true },
  source: { type: String }, // e.g., 'ad', 'bonus', 'discount'
}, { timestamps: true });

module.exports = mongoose.model('CoinTransaction', coinTransactionSchema);
