import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/product";

const addProduct = async (formData) => {
  const token = localStorage.getItem("adminToken");

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const response = await axios.post(`${API_URL}/add_product`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error Adding Product", error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetchProducts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

//fetch product with limit (pagination)
const fetchProductsLimit = async(page, limit = 4) => {
  try {
    const response = await axios.get(`${API_URL}/productLimit`, {
      params: {
        page,
        limit,
      }
    })

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error while getting product", error);
  }
};

//EDIT--PRODUCT
const editProduct = async (id, data) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Product Updated");
  } catch ({ error }) {
    console.log(error);
    toast.error("Error Updating Product");
  }
};

//TOOGLE--PRODUCT--ISDELETED
const toggleProductState = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.patch(
      `${API_URL}/toggle/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Error toggling product status:", error);
    toast.error("Failed to update product status");
  }
};

const productCheckout = async (productIds) => {
  try {
    const token = localStorage.getItem("userToken");

    const response = await axios.post(
      `${API_URL}/product-checkout`,
      productIds,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("prodcts response", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  addProduct,
  fetchProducts,
  getProduct,
  toggleProductState,
  editProduct,
  productCheckout,
  fetchProductsLimit,
};
