import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/coupon";

const fetchCoupons = async () => {
  try {
    const response = await axios.get(`${API_URL}/coupons`);

    return response.data.coupons;
  } catch (error) {
    console.log(error);
  }
};

const createCoupon = async (couponData) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.post(`${API_URL}/create`, couponData, {
      headers: {
        Authorization: `Bearer, ${token}`,
      },
    });
    console.log(response);
    toast.success("Coupon Created!! ");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteCoupon = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.delete(`${API_URL}/coupon/${id}`, {
      headers: {
        Authorization: `Bearer, ${token}`,
      },
    });
    toast.success("Coupon Deleted!!");
  } catch (error) {
    console.log(error);
  }
};

const verifyCouponCode = async (code) => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await axios.post(`${API_URL}/verify`, {code}, {
      headers: {
        Authorization: `Bearer, ${token}`,
      },
    });
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
    if(error.response.status === 404){
        toast.error(error.response.data.message)
    } else if(error.response.status === 400){
        toast.error(error.response.data.message)
    }else {
        toast.error("Server error. Please try again later.")
    }
  }
};

export { fetchCoupons, createCoupon, deleteCoupon, verifyCouponCode };
