// src/api/axios.js
import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({
  // Automatically use backend URL depending on environment
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Automatically attach JWT token (if logged in)
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Optional: Handle 401 (unauthorized) errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Please log in again.");
      localStorage.removeItem("user");
      // Redirect to login page only if not already on login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;