import axios from "axios";

const API_URL = "http://localhost:3000/admin";

// ADMIN--LOGIN
const adminlogin = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/admin_login`, userData);
    if (response.status === 200 && response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      return true; // Success
    } else {
      return false; // Login failed
    }
  } catch (error) {
    console.error("Error While Admin login:", error);
    return false; // Error occurred
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

export { adminlogin, fetchUsers, blockUser, unblockUser };