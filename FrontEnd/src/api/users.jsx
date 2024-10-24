import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:3000/user";

//Sign--Up
const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    console.log(response);


    if (response.status === 201) {
      localStorage.setItem("userToken", response.data.token);
      return response.data;
    }
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("User already exists")
  }
};

//Login
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.status === 200) {
      toast.success("Login Successful");
      localStorage.setItem("userToken", response.data.token);
      return response.data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    throw error;
  }
};

//Storing user google info
const storeGoogleInfo = async(userData) => {
  try {
    await axios.post(`${API_URL}/googleUser`, userData);
  } catch (error) {
    console.log(error);
  }
}

const updateUserData = async(userData) => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await axios.post(`${API_URL}/update-userdata`, userData, {
      headers:{
        Authorization: `Bearer ${token}`, 
      }
    })
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const logout = () => {
  localStorage.removeItem('userToken');
  toast.success("You have successfully logged out!");
}

export { signUp, login, logout, storeGoogleInfo, updateUserData };
