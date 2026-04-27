import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hireready_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("hireready_token");
        localStorage.removeItem("hireready_user");
        window.location.href = "/login";
      }

      if (status === 500) {
        console.error("Server error. Please try again later.");
      }
    }

    return Promise.reject(error);
  }
);
console.log("BASE URL:", API_BASE_URL);

export default api;