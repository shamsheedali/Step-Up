import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/order";

const createOrder = async (orderDetails) => {
  try {
    console.log("frontEnd", orderDetails);
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

const getUserOrders = async (userId) => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/orders/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

    console.log("response", response)
    return response;
  } catch (error) {
    console.log(error);
  }
};

//cancel order
const cancelOrder = async(orderId) => {
  try {
    const token = localStorage.getItem('userToken');
    
    const response = await axios.delete(`${API_URL}/order-delete/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response);
    toast.success("Order Cancelled");
  } catch (error) {
    console.log(error);
  }
}

export { createOrder, getUserOrders, getOrderProducts, cancelOrder };
