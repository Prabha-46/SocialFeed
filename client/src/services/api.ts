import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling expired/invalid JWT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      // Dispatch a custom event to open the login modal
      window.dispatchEvent(new Event("open-login-modal"));
    }
    return Promise.reject(error);
  }
);

export default api;
