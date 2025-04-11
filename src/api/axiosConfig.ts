import axios from 'axios';
import { getToken, removeToken } from '../utils/localStorage';

// Định nghĩa base URL cho API
const API_URL = 'http://localhost:5241/api';

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token nếu nhận được lỗi 401 Unauthorized
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;