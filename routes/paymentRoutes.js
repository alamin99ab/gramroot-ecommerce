const express = require('express');
const router = express.Router();
const { initiatePayment, sslResponse } = require('../controllers/paymentController');

router.post('/ssl-initiate', initiatePayment);
router.post('/ssl-response', sslResponse);

module.exports = router;
