import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

// ADMIN--LOGIN
const adminlogin = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/admin_login`, userData);
    if (response.status === 200 && response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    console.error("Error While Admin login:", error);
    return false; 
  }
};

// FETCH--ALL-USERS
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`${API_URL}/get_users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// BLOCK USER
const blockUser = async (userId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.patch(`${API_URL}/${userId}/block`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error);
  }
};

// UNBLOCK USER
const unblockUser = async (userId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.patch(`${API_URL}/${userId}/unblock`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error unblocking user:", error);
  }
};

//ADMIN LOGOUT
const adminLogoutFunction = async () => {
  localStorage.removeItem('adminToken');
  toast.success("You have successfully logged out!");
}

export { adminlogin, fetchUsers, blockUser, unblockUser, adminLogoutFunction };