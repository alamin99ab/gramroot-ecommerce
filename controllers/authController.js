const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register (send OTP, no JWT yet)
exports.register = async (req, res) => {
  const { name, phone, email, password, referralCode } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  try {
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 5 * 60 * 1000; // 5 min from now

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      referralCode: phone?.slice(-4) + Math.floor(Math.random() * 1000),
      referredBy: referralCode || null,
      otpCode: otp,
      otpExpires: otpExpire,
      isVerified: false,
      registrationIP: ip
    });

    await newUser.save();

    // Send OTP Email
    if (email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.OTP_EMAIL,
          pass: process.env.OTP_EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.OTP_EMAIL,
        to: email,
        subject: 'GramRootFoods OTP Verification',
        text: `Your OTP code is ${otp}. It expires in 5 minutes.`
      });
    } else {
      console.log(`OTP for phone ${phone}: ${otp}`);
    }

    res.status(201).json({ message: 'Registered successfully. OTP sent for verification.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Verify OTP and send JWT
exports.verifyOtp = async (req, res) => {
  const { email, phone, otp } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ message: 'User already verified' });

    if (user.otpCode !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

// Login (only verified users)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your account first' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
