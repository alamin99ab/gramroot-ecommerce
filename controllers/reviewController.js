const Review = require('../models/Review');

exports.getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email') // ইউজার ইনফো চাইলে
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
