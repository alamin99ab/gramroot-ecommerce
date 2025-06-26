const SSLCommerzPayment = require('sslcommerz-lts');

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false; // true in production

// Initiate payment
exports.initiatePayment = async (req, res) => {
  const { orderId, totalAmount, customerInfo } = req.body;

  const data = {
    total_amount: totalAmount,
    currency: 'BDT',
    tran_id: orderId,
    success_url: `${process.env.BASE_URL}/api/payment/ssl-response`,
    fail_url: `${process.env.BASE_URL}/api/payment/ssl-response`,
    cancel_url: `${process.env.BASE_URL}/api/payment/ssl-response`,
    ipn_url: `${process.env.BASE_URL}/api/payment/ipn`,

    cus_name: customerInfo.name,
    cus_email: customerInfo.email,
    cus_add1: customerInfo.address,
    cus_phone: customerInfo.phone,

    shipping_method: 'NO',
    product_name: 'GramRootFoods Order',
    product_category: 'ecommerce',
    product_profile: 'general',
  };

  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcommerz.init(data).then(apiResponse => {
    // Redirect URL
    const GatewayPageURL = apiResponse.GatewayPageURL;
    res.json({ url: GatewayPageURL });
  }).catch(err => {
    res.status(500).json({ message: "Payment initiation failed", error: err.message });
  });
};

// Payment response handler
exports.sslResponse = async (req, res) => {
  const data = req.body;
  // TODO: Validate response, update order status accordingly
  console.log('SSLCOMMERZ Response:', data);
  res.status(200).json({ message: "Payment response received" });
};
