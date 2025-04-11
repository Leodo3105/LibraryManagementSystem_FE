export interface AdminDashboardStats {
    totalBooks: number;
    totalUsers: number;
    totalCategories: number;
    totalLoans: number;
    activeLoans: number;
    overdueLoans: number;
    popularBooks: PopularBook[];
    lowStockBooks: LowStockBook[];
  }
  
  export interface PopularBook {
    id: number;
    title: string;
    loanCount: number;
  }
  
  export interface LowStockBook {
    id: number;
    title: string;
    availableCopies: number;
    totalCopies: number;
  }
  
  export interface UserRoleUpdate {
    userId: number;
    role: string;
  }