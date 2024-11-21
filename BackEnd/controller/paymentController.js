import razorpayInstance from '../razorpay/razorpay.js';
import HttpStatus from '../utils/httpStatus.js';

const createTransaction = async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100,
    currency: currency || "INR",
    receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(HttpStatus.OK).json(order);
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export { createTransaction };
