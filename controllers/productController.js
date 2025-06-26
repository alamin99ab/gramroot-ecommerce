
const Product = require('../models/Product');

// 🔍 Get All Products (search & category filter)
exports.getProducts = async (req, res) => {
  const { category, search } = req.query;
  let query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  const products = await Product.find(query);
  res.json(products);
};

// 📦 Get Single Product
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// ⭐️ Add Review
exports.addReview = async (req, res) => {
  const { rating, comment, image } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) return res.status(400).json({ message: "Already reviewed" });

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
    image
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

  await product.save();
  res.status(201).json({ message: "Review added" });
};

// ➕ Admin: Create Product
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ message: "Product created", product });
};

// ✏️ Admin: Update Product
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "Product updated", product });
};

// ❌ Admin: Delete Product
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
