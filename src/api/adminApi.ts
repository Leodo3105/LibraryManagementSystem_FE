import axiosInstance from './axiosConfig';
import { AdminDashboardStats } from '../types/admin.types';
import { User } from '../types/user.types';

// Lấy thống kê dashboard
export const getDashboardStats = async () => {
  const response = await axiosInstance.get<AdminDashboardStats>('/admin/dashboard');
  return response.data;
};

// Lấy danh sách người dùng
export const getUsers = async () => {
  const response = await axiosInstance.get<User[]>('/admin/users');
  return response.data;
};

// Cập nhật vai trò người dùng
export const updateUserRole = async (userId: number, role: string) => {
  const response = await axiosInstance.put(`/admin/users/${userId}/role`, JSON.stringify(role), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Tạo người dùng mới
export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post('/admin/users', userData);
  return response.data;
};