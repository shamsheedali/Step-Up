import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/payment";

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const handlePayment = async (username, email, totalAmount, phonenumber) => {
  console.log(username, email, totalAmount, phonenumber);
  try {
    const { data } = await axios.post(`${API_URL}/createTransaction`, {
      amount: totalAmount,
      currency: "INR",
    });

    console.log(data);

    // Return a Promise to handle the payment result
    return new Promise((resolve, reject) => {
      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "StepUp",
        description: "Payment for Product",
        handler: function (response) {
          toast.success(`Payment Successful`);
          console.log(response.razorpay_payment_id);
          console.log(response.razorpay_order_id);
          console.log(response.razorpay_signature);
          resolve(true);
        },
        prefill: {
          name: username,
          email: email,
          contact: phonenumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay payment form
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // Handle payment failure
      razorpay.on("payment.failed", function (response) {
        toast.error(response.error.description);
        reject(false);
      });
    });
  } catch (error) {
    console.error("Payment Error: ", error);
    return false; 
  }
};


export { handlePayment };
