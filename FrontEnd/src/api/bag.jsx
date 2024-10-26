import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/bag";

//Add product to bag
const addToBag = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/addto-bag`, data);

    if (response.status === 200) {
      toast.success(response.data.message);
    }
  } catch (error) {
    if (response.status === 404) {
      toast.error(response.data.message);
    } else {
      toast.error("Error adding product to bag");
    }
  }
};

//get bag info
const fetchBag = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//remove product from bag
const delFromBag = async (userId, productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${userId}/product/${productId}`
    );

    toast.success("Product Removed From Bag");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { addToBag, fetchBag, delFromBag };
