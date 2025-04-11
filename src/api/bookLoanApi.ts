import axiosInstance from './axiosConfig';
import {BookLoanCreate, BookLoanUpdate, BookLoanSearchParams } from '../types/bookLoan.types';

// Lấy danh sách phiếu mượn của người dùng hiện tại
export const getUserLoans = async (params?: BookLoanSearchParams) => {
  const response = await axiosInstance.get('/users/loans', { params });
  return response.data;
};

// Lấy danh sách tất cả phiếu mượn (Admin)
export const getAllLoans = async (params?: BookLoanSearchParams) => {
  const response = await axiosInstance.get('/bookloans', { params });
  return response.data;
};

// Lấy chi tiết một phiếu mượn
export const getBookLoanById = async (id: number) => {
  const response = await axiosInstance.get(`/bookloans/${id}`);
  return response.data;
};

// Tạo phiếu mượn mới
export const createBookLoan = async (data: BookLoanCreate) => {
  const response = await axiosInstance.post('/bookloans', data);
  return response.data;
};

// Cập nhật trạng thái phiếu mượn
export const updateBookLoan = async (id: number, data: BookLoanUpdate) => {
  const response = await axiosInstance.put(`/bookloans/${id}`, data);
  return response.data;
};