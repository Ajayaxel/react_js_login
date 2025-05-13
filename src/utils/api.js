// src/utils/api.js
import axios from "axios";

const BASE_URL = "https://backend.pinkstories.ae/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
