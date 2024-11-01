import axios from "axios";

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

    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      name: "StepUp",
      description: "Payment for Product",
      handler: function (response) {
        alert(`Payment Successful: ${response.razorpay_payment_id}`);
        console.log(response.razorpay_payment_id);
        console.log(response.razorpay_order_id);
        console.log(response.razorpay_signature);
        // Handle post-payment actions (e.g., updating your backend, showing confirmation, etc.)
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

    //Open Razorpay payment form
    const razorpay = new window.Razorpay(options);
    razorpay.open();

    razorpay.on("payment.failed", function (response) {
      alert(response.error.description);
    });
  } catch (error) {
    console.error("Payment Error: ", error);
  }
};

export { handlePayment };
