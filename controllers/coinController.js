// controllers/coinController.js

const CoinTransaction = require('../models/CoinTransaction');
const CoinSettings = require('../models/CoinSettings');
const User = require('../models/User');

// 💰 Dashboard: User coin balance + history
const getCoinDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const transactions = await CoinTransaction.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      coins: user.coins,
      transactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load coin dashboard' });
  }
};

// 💰 Earn Coin (ad, referral, bonus, quiz)
const earnCoin = async (req, res) => {
  const { source } = req.body;

  try {
    const settings = await CoinSettings.findOne();
    let amount = 0;

    if (source === 'ad' && settings.adCoinEnabled) amount = settings.adCoinValue;
    else if (source === 'bonus' && settings.loginBonusEnabled) amount = settings.loginBonusCoinValue;
    else if (source === 'referral' && settings.referralEnabled) amount = settings.referralCoinValue;
    else if (source === 'quiz') amount = 15; // Static fallback
    else return res.status(400).json({ message: "Invalid or disabled coin source" });

    await CoinTransaction.create({
      user: req.user._id,
      amount,
      type: 'earn',
      source
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { coins: amount } });

    res.json({ message: `Earned ${amount} coins from ${source}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to earn coin' });
  }
};

// 💸 Spend Coin (checkout, mystery, etc.)
const spendCoin = async (req, res) => {
  const { amount, purpose } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user.coins < amount) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    await CoinTransaction.create({
      user: req.user._id,
      amount,
      type: 'spend',
      source: purpose
    });

    user.coins -= amount;
    await user.save();

    res.json({ message: `Spent ${amount} coins on ${purpose}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to spend coin' });
  }
};

// ✅ Admin: Get Coin Settings
const getCoinSettings = async (req, res) => {
  try {
    const settings = await CoinSettings.findOne();
    if (!settings) {
      const defaultSettings = new CoinSettings({});
      await defaultSettings.save();
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch coin settings' });
  }
};

// ✅ Admin: Update Coin Settings
const updateCoinSettings = async (req, res) => {
  try {
    const updated = await CoinSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update coin settings' });
  }
};

// ✅ Final Export
module.exports = {
  getCoinDashboard,
  earnCoin,
  spendCoin,
  getCoinSettings,
  updateCoinSettings
};
