const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/products/:id/reviews', reviewController.getReviewsByProduct);

module.exports = router;
