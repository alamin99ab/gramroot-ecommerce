const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addReview } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/review/:productId', protect, addReview);

module.exports = router;
