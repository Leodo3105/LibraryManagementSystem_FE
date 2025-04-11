import axiosInstance from './axiosConfig';
import { LoginFormData, RegisterFormData, AuthResponse } from '../types/auth.types';

// Đăng nhập
export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return response.data;
};

// Đăng ký
export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
  return response.data;
};

// Lấy thông tin profile
export const getProfile = async () => {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
};