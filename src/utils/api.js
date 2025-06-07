// src/utils/api.js
import axios from "axios";

export const BASE_URL = "http://localhost:7000/api/";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ✅ Automatically attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from cookies / auth context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;



