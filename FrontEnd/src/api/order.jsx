import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/order";

const createOrder = async (orderDetails) => {
  try {
    const token = localStorage.getItem("userToken");

    const response = await axios.post(`${API_URL}/createOrder`, orderDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      toast.success("You placed an order");
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserOrders = async (userId, page, limit) => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await axios.get(
      `${API_URL}/orders/${userId}`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getOrderProducts = async (orderId) => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/orders/${orderId}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("this", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//cancel order
const cancelOrder = async (orderId, uid) => {
  try {
    const token = localStorage.getItem("userToken");

    const response = await axios.delete(
      `${API_URL}/order-delete/${orderId}/${uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    toast.success("Order Cancelled");
  } catch (error) {
    console.log(error);
  }
};

//get all orders
const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/getallorders`);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//get orders for pagination
const orderLimit = async (page, limit) => {
  try {
    const response = await axios.get(`${API_URL}/limitOrders`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//change status
const changeStatus = async (orderId, status) => {
  try {
    const response = await axios.get(
      `${API_URL}/change_status?status=${status}&orderId=${orderId}`
    );

    if (response.status === 200) {
      toast.success(response.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(response.data.message);
  }
};

//change payment status
const changePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const response = await axios.get(
      `${API_URL}/change_payment_status?paymentStatus=${paymentStatus}&orderId=${orderId}`
    );
    if (response.status === 200) {
      console.log(response.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(response.data.message);
  }
};

//Sales-report
const salesReport = async (date) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.post(`${API_URL}/sales-report`, date, {
      headers: {
        Authorization: `Bearer, ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  createOrder,
  getUserOrders,
  getOrderProducts,
  cancelOrder,
  getOrders,
  changeStatus,
  salesReport,
  changePaymentStatus,
  orderLimit,
};
