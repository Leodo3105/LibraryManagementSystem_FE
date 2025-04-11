import React, { createContext, useEffect, useState } from 'react';
import { 
  AuthContextType, 
  User, 
  LoginFormData, 
  RegisterFormData 
} from '../types/auth.types';
import { login as loginApi, register as registerApi } from '../api/authApi';
import { saveToken, saveUser, getUser, getToken, clearAuth } from '../utils/localStorage';

// Tạo context với giá trị mặc định
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập hay chưa khi component mount
    const checkAuth = () => {
      const token = getToken();
      const savedUser = getUser();
      
      if (token && savedUser) {
        setUser(savedUser);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Đăng nhập
  const login = async (data: LoginFormData) => {
    try {
      const response = await loginApi(data);
      saveToken(response.token);
      saveUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Đăng ký
  const register = async (data: RegisterFormData) => {
    try {
      const response = await registerApi(data);
      saveToken(response.token);
      saveUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // Đăng xuất
  const logout = () => {
    clearAuth();
    setUser(null);
  };

  // Kiểm tra role admin
  const isAdmin = user?.role === 'Admin';

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};