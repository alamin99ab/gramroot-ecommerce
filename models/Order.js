// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: Number
    }
  ],
  address: String,
  paymentMethod: { type: String, enum: ['COD', 'SSLCOMMERZ', 'COIN'] },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  coinUsed: { type: Number, default: 0 },
  trackingId: { type: String },
  estimatedDelivery: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
