import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import UserLoansPage from './pages/UserLoansPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLoanManagementPage from './pages/admin/AdminLoanManagementPage';
import AdminBooksPage from './pages/admin/AdminBooksPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ element: React.ReactElement; adminRequired?: boolean }> = ({ 
  element, 
  adminRequired = false 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminRequired && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return element;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              
              {/* Protected User Routes */}
              <Route 
                path="/my-loans" 
                element={<ProtectedRoute element={<UserLoansPage />} />} 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={<ProtectedRoute element={<AdminDashboardPage />} adminRequired />} 
              />
              <Route 
                path="/admin/books" 
                element={<ProtectedRoute element={<AdminBooksPage />} adminRequired />} 
              />
              <Route 
                path="/admin/categories" 
                element={<ProtectedRoute element={<AdminCategoriesPage />} adminRequired />} 
              />
              <Route 
                path="/admin/loans" 
                element={<ProtectedRoute element={<AdminLoanManagementPage />} adminRequired />} 
              />
              <Route 
                path="/admin/users" 
                element={<ProtectedRoute element={<AdminUsersPage />} adminRequired />} 
              />
              
              {/* Fallback route (404) */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;