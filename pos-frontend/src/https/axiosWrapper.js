import axios from "axios";

// Default headers
const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Create Axios instance
export const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api", // backend base URL
  withCredentials: false, // using Bearer token, not cookies
  headers: { ...defaultHeader },
});

// Attach JWT token to every request automatically
axiosWrapper.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // Remove Content-Type for FormData to allow browser to set boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor for global error handling
axiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle 401 Unauthorized globally if needed
    return Promise.reject(error);
  }
);
