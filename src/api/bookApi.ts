import axiosInstance from './axiosConfig';
import { BookSearchParams } from '../types/book.types';

// Lấy danh sách sách với tìm kiếm và phân trang
export const getBooks = async (params: BookSearchParams) => {
  const response = await axiosInstance.get('/books', { params });
  return response.data;
};

// Lấy chi tiết một cuốn sách
export const getBookById = async (id: number) => {
  const response = await axiosInstance.get(`/books/${id}`);
  return response.data;
};

// Lấy danh sách thể loại
export const getCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

// Tạo sách mới (Admin)
export const createBook = async (bookData: FormData) => {
  const response = await axiosInstance.post('/books', bookData);
  return response.data;
};

// Cập nhật sách (Admin)
export const updateBook = async (id: number, bookData: FormData) => {
  const response = await axiosInstance.put(`/books/${id}`, bookData);
  return response.data;
};

// Xóa sách (Admin)
export const deleteBook = async (id: number) => {
  const response = await axiosInstance.delete(`/books/${id}`);
  return response.data;
};

// Tải lên hình ảnh
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post('/uploads/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.imageUrl;
};