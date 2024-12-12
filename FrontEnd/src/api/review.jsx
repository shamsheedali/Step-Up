import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_URL}/review`;

// Add a review
const addReview = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/addReview`, data);
    if (response.status === 201) {
      toast.success("Review added successfully!");
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message || "Invalid input data.");
    } else {
      toast.error("Error adding review. Please try again later.");
    }
  }
};

// Fetch reviews for a product
const fetchReviews = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data.reviews; 
  } catch (error) {
    console.log(error);
  }
};

// Exporting the services
export { addReview, fetchReviews };
