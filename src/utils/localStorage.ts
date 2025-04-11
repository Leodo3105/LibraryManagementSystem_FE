// Constants
const TOKEN_KEY = 'library_token';
const USER_KEY = 'library_user';

// Định nghĩa kiểu User
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Lấy token từ localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Lưu token vào localStorage
export const saveToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Xóa token khỏi localStorage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Lưu thông tin user
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Lấy thông tin user
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Xóa thông tin user
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Xóa tất cả dữ liệu authentication
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};