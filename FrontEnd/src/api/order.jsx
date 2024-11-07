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

    console.log("this", response);
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

//get all orders for admin
const getOrders = async() => {
  try {
    const response = await axios.get(`${API_URL}/getallorders`);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error)
  }
}

//change status
const changeStatus = async(orderId, status) => {
  try {
    const response = await axios.get(`${API_URL}/change_status?status=${status}&orderId=${orderId}`);

    if(response.status === 200){
      toast.success(response.data.message);
    }
  } catch (error) {
    console.log(error)
    toast.error(response.data.message);
  }
}

//Sales-report
const salesReport = async(date) => {
  const token = localStorage.getItem('adminToken');
  try {
    const response = await axios.post(`${API_URL}/sales-report`, date, {
      headers: {
        Authorization: `Bearer, ${token}`,
      }
    })
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export { createOrder, getUserOrders, getOrderProducts, cancelOrder, getOrders, changeStatus, salesReport };
