export interface LoginFormData {
    username: string;
    password: string;
  }
  
  export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (data: LoginFormData) => Promise<void>;
    register: (data: RegisterFormData) => Promise<void>;
    logout: () => void;
  }