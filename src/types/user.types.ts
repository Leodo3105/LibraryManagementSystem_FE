export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
  }
  
  export interface UserExtended extends User {
    createdAt: string;
    updatedAt?: string;
    // Thêm các trường khác nếu cần
  }