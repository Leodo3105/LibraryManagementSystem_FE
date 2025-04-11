export interface BookLoan {
    id: number;
    userId: number;
    username: string;
    bookId: number;
    bookTitle: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: string; // "Pending", "Approved", "Rejected", "Returned", "Overdue"
    notes?: string;
  }
  
  export interface BookLoanCreate {
    bookId: number;
    notes?: string;
  }
  
  export interface BookLoanUpdate {
    status: string;
    notes?: string;
  }
  
  export interface BookLoanSearchParams {
    status?: string;
    userId?: number;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
  }
  
  // Constants for status values
  export const LOAN_STATUS = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    RETURNED: 'Returned',
    OVERDUE: 'Overdue'
  };