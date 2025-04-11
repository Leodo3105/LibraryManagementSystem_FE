import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getCategories } from '../../api/bookApi';
import { Category } from '../../types/book.types';
import CategoryFormDialog from '../../components/admin/CategoryFormDialog';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Box, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for category form dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Không thể tải danh sách thể loại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCategory = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleOpenDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await axios.delete(`/api/categories/${categoryToDelete.id}`);
      
      // Remove the deleted category from the list
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      
      setSuccessMessage(`Thể loại "${categoryToDelete.name}" đã được xóa thành công`);
      setDeleteDialogOpen(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Error deleting category:', err);
      
      // Show specific error for categories with books
      if (err.response?.status === 400 && err.response?.data?.message?.includes("books")) {
        setError("Không thể xóa thể loại này vì đang có sách thuộc thể loại này.");
      } else {
        setError(err.response?.data?.message || 'Không thể xóa thể loại. Vui lòng thử lại sau.');
      }
      
      setDeleteDialogOpen(false);
    }
  };
  
  const handleCategorySaved = (savedCategory: Category) => {
    if (editingCategory) {
      // Update existing category in the list
      setCategories(categories.map(cat => cat.id === savedCategory.id ? savedCategory : cat));
      setSuccessMessage(`Thể loại "${savedCategory.name}" đã được cập nhật thành công`);
    } else {
      // Add new category to the list
      setCategories([savedCategory, ...categories]);
      setSuccessMessage(`Thể loại "${savedCategory.name}" đã được thêm thành công`);
    }
    
    setDialogOpen(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Quản Lý Thể Loại
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
          >
            Thêm Thể Loại Mới
          </Button>
        </Box>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : categories.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Chưa có thể loại nào</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{ mt: 2 }}
            >
              Thêm Thể Loại Mới
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên thể loại</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="center">Số lượng sách</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell component="th" scope="row">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description || 'Không có mô tả'}</TableCell>
                    <TableCell align="center">{category.bookCount}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditCategory(category)}
                        aria-label="Sửa"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(category)}
                        aria-label="Xóa"
                        disabled={category.bookCount > 0}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Category Form Dialog */}
        <CategoryFormDialog 
          open={dialogOpen}
          onClose={handleCloseDialog}
          category={editingCategory}
          onSave={handleCategorySaved}
        />
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa thể loại "{categoryToDelete?.name}" không? 
              Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
            <Button onClick={handleDeleteCategory} color="error">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;