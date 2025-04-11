import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getBooks, getCategories } from '../api/bookApi';
import { Book, Category, BookSearchParams } from '../types/book.types';
import {
  Container, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, TextField, MenuItem, Pagination, Box
} from '@mui/material';

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchParams, setSearchParams] = useState<BookSearchParams>({
    searchTerm: '',
    categoryId: undefined,
    page: 1,
    pageSize: 12
  });
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách thể loại:', err);
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
        
        // Lấy thông tin phân trang từ headers
        const totalItems = parseInt(response.headers['x-pagination-totalitems'] || '0');
        const pageSize = searchParams.pageSize || 12;
        setTotalPages(Math.ceil(totalItems / pageSize));
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sách:', err);
        setError('Không thể tải danh sách sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [searchParams]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, searchTerm: e.target.value, page: 1 }));
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === 'all' ? undefined : Number(e.target.value);
    setSearchParams(prev => ({ ...prev, categoryId: value, page: 1 }));
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };
  
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Danh Sách Sách
        </Typography>
        
        {/* Phần Tìm kiếm và Lọc */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <TextField
            label="Tìm kiếm sách"
            variant="outlined"
            size="small"
            fullWidth
            value={searchParams.searchTerm}
            onChange={handleSearchChange}
            sx={{ flex: 3 }}
          />
          
          <TextField
            select
            label="Thể loại"
            variant="outlined"
            size="small"
            value={searchParams.categoryId || 'all'}
            onChange={handleCategoryChange}
            sx={{ flex: 1 }}
          >
            <MenuItem value="all">Tất cả thể loại</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {books.length === 0 ? (
              <Typography>Không tìm thấy sách nào.</Typography>
            ) : (
              <Grid container spacing={3}>
                {books.map(book => (
                  <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={book.coverImageUrl || '/placeholder-book.png'}
                        alt={book.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2" noWrap>
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {book.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thể loại: {book.categoryName}
                        </Typography>
                        <Typography variant="body2">
                          Có sẵn: {book.availableCopies}/{book.totalCopies}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          component={Link} 
                          to={`/books/${book.id}`}
                        >
                          Xem chi tiết
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Phân trang */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={searchParams.page || 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default BooksPage;