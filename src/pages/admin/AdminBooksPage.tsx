import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getBooks, getCategories, deleteBook } from '../../api/bookApi';
import { Book, BookSearchParams, Category } from '../../types/book.types';
import BookFormDialog from '../../components/admin/BookFormDialog';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Box, TextField,
  MenuItem, Pagination, IconButton, Chip, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  Alert, Grid, FormControl, InputLabel, Select, SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const AdminBooksPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [searchParams, setSearchParams] = useState<BookSearchParams>({
    searchTerm: '',
    categoryId: undefined,
    page: 1,
    pageSize: 10
  });
  
  const [totalPages, setTotalPages] = useState(1);
  
  // State for book form dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getBooks(searchParams);
        setBooks(response);
        
        // Get pagination info from headers
        const totalItems = parseInt(response.headers['x-pagination-totalitems'] || '0');
        setTotalPages(Math.ceil(totalItems / (searchParams.pageSize || 10)));
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Không thể tải danh sách sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [searchParams]);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, searchTerm: e.target.value, page: 1 }));
  };
  
  const handleCategoryChange = (e: SelectChangeEvent) => {
    const value = e.target.value === 'all' ? undefined : Number(e.target.value);
    setSearchParams(prev => ({ ...prev, categoryId: value, page: 1 }));
  };
  
  const handleAddBook = () => {
    setEditingBook(null);
    setDialogOpen(true);
  };
  
  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleOpenDeleteDialog = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    
    try {
      await deleteBook(bookToDelete.id);
      
      // Remove the deleted book from the list
      setBooks(books.filter(book => book.id !== bookToDelete.id));
      
      setSuccessMessage(`Sách "${bookToDelete.title}" đã được xóa thành công`);
      setDeleteDialogOpen(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Error deleting book:', err);
      setError(err.response?.data?.message || 'Không thể xóa sách. Vui lòng thử lại sau.');
      setDeleteDialogOpen(false);
    }
  };
  
  const handleBookSaved = (savedBook: Book) => {
    if (editingBook) {
      // Update existing book in the list
      setBooks(books.map(book => book.id === savedBook.id ? savedBook : book));
      setSuccessMessage(`Sách "${savedBook.title}" đã được cập nhật thành công`);
    } else {
      // Add new book to the list
      setBooks([savedBook, ...books]);
      setSuccessMessage(`Sách "${savedBook.title}" đã được thêm thành công`);
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
            Quản Lý Sách
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddBook}
          >
            Thêm Sách Mới
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
        
        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tìm kiếm sách"
                variant="outlined"
                value={searchParams.searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: <SearchIcon color="action" />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Thể loại</InputLabel>
                <Select
                  value={searchParams.categoryId?.toString() || 'all'}
                  label="Thể loại"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="all">Tất cả thể loại</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : books.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Không tìm thấy sách nào</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddBook}
              sx={{ mt: 2 }}
            >
              Thêm Sách Mới
            </Button>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Tác giả</TableCell>
                    <TableCell>Thể loại</TableCell>
                    <TableCell align="center">Có sẵn / Tổng</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell component="th" scope="row">
                        {book.title}
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Chip label={book.categoryName} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        {book.availableCopies} / {book.totalCopies}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditBook(book)}
                          aria-label="Sửa"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleOpenDeleteDialog(book)}
                          aria-label="Xóa"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={totalPages} 
                  page={searchParams.page || 1} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            )}
          </>
        )}
        
        {/* Book Form Dialog */}
        <BookFormDialog 
          open={dialogOpen}
          onClose={handleCloseDialog}
          book={editingBook}
          categories={categories}
          onSave={handleBookSaved}
        />
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa sách "{bookToDelete?.title}" không? 
              Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
            <Button onClick={handleDeleteBook} color="error">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default AdminBooksPage;