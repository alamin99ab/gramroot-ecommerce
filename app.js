// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// 🔗 Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const coinRoutes = require('./routes/coinRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminCoinRoutes = require('./routes/adminCoinRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reportRoutes = require('./routes/reportRoutes');
const logoutRoutes = require('./routes/logoutRoutes');

// 🚀 Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coin', coinRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminCoinRoutes);
app.use('/api', paymentRoutes);
app.use('/api', reviewRoutes); // ✅ Example: GET /api/products/:id/reviews
app.use('/api/admin/reports', reportRoutes);
app.use('/api', logoutRoutes);

// 🏁 Root Route
app.get('/', (req, res) => {
  res.send('🌱 GramRootFoods Backend API Running...');
});

module.exports = app;
