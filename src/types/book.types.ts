export interface Book {
    id: number;
    title: string;
    author: string;
    isbn?: string;
    publicationYear?: number;
    publisher?: string;
    totalCopies: number;
    availableCopies: number;
    categoryId: number;
    categoryName: string;
    coverImageUrl?: string;
    description?: string;
  }
  
  
  
  export interface Category {
    id: number;
    name: string;
    description?: string;
    bookCount: number;
  }
  
  export interface BookSearchParams {
    searchTerm?: string;
    categoryId?: number;
    page?: number;
    pageSize?: number;
  }
  
  export interface BookCreateDto {
    title: string;
    author: string;
    isbn?: string;
    publicationYear?: number;
    publisher?: string;
    totalCopies: number;
    categoryId: number;
    coverImageUrl?: string;
    description?: string;
  }
  
 