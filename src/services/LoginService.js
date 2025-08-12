import axios from "axios";
import { API_URL } from "../config"

// Login function that returns the response data from the backend after a successful login
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signin`, {
      username,
      password,
    });
    return response.data; // returns the response, including accessToken and user info
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

// Fetch user information using the access token
const getUserInfo = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the token for authorization
      },
    });
    return response.data; // Returns user information
  } catch (error) {
    throw new Error("Error fetching user information. Please try again.");
  }
};

const register = async (data) => {
  const res = await axios.post(`${API_URL}/api/auth/signup`, data);
  if (res.status !== 200) {
    throw new Error("Registration failed. Please try again.");
  }
  return res.data;
};

export { login, getUserInfo, register };

