import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_URL}/payment`;

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

const handlePayment = async (username, email, totalAmount, phonenumber) => {
  console.log(username, email, totalAmount, phonenumber);
  try {
    const { data } = await axios.post(`${API_URL}/createTransaction`, {
      amount: totalAmount,
      currency: "INR",
    });

    console.log(data);

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
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            paymentStatus: "completed",
          });
        },
        prefill: {
          name: username,
          email: email,
          contact: phonenumber,
        },
        theme: {
          color: "#000",
        },
        modal: {
          ondismiss: function () {
            console.log("Checkout form closed by the user");
            reject({ success: false, error: "closed" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        console.log("Error in HandlePayment");
        toast.error(response.error.description);

        // window.location.href = "/bag/checkout/order-success";
        reject({
          success: false,
          error: response.error,
        });
      });
    });
  } catch (error) {
    console.error("Payment Error: ", error);
    return { success: false, error: "Payment initialization failed" };
  }
};

export { handlePayment };
