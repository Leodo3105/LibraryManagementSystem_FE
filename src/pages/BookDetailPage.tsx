import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import { getBookById } from '../api/bookApi';
import { createBookLoan } from '../api/bookLoanApi';
import { BookDetail } from '../types/book.types';
import {
  Container, Typography, Grid, Box, Button, Card, CardMedia,
  Divider, Chip, Alert, Paper
} from '@mui/material';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [borrowError, setBorrowError] = useState('');
  
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const data = await getBookById(Number(id));
        setBook(data);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin sách:', err);
        setError('Không thể tải thông tin sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBook();
    }
  }, [id]);
  
  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await createBookLoan({ bookId: Number(id) });
      setBorrowSuccess(true);
      setBorrowError('');
      
      // Refresh book data to get updated availability
      const updatedBook = await getBookById(Number(id));
      setBook(updatedBook);
    } catch (err: any) {
      console.error('Lỗi khi mượn sách:', err);
      setBorrowError(err.response?.data?.message || 'Không thể mượn sách. Vui lòng thử lại sau.');
      setBorrowSuccess(false);
    }
  };
  
  if (loading) return <Layout><Container><Typography>Đang tải...</Typography></Container></Layout>;
  if (error) return <Layout><Container><Typography color="error">{error}</Typography></Container></Layout>;
  if (!book) return <Layout><Container><Typography>Không tìm thấy sách.</Typography></Container></Layout>;
  
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {borrowSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Yêu cầu mượn sách đã được gửi thành công! Vui lòng đợi phê duyệt.
          </Alert>
        )}
        
        {borrowError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {borrowError}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          {/* Book Cover */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                image={book.coverImageUrl || '/placeholder-book.png'}
                alt={book.title}
                sx={{ height: 'auto', maxHeight: 500 }}
              />
            </Card>
          </Grid>
          
          {/* Book Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {book.title}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {book.author}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={book.categoryName} 
                color="primary" 
                size="small" 
                sx={{ mr: 1 }} 
              />
              {book.publicationYear && (
                <Typography variant="body2" color="text.secondary">
                  Năm xuất bản: {book.publicationYear}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số bản sao
                  </Typography>
                  <Typography variant="h6">
                    {book.totalCopies}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Có sẵn
                  </Typography>
                  <Typography variant="h6">
                    {book.availableCopies}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {book.isbn && (
              <Typography variant="body2" gutterBottom>
                <strong>ISBN:</strong> {book.isbn}
              </Typography>
            )}
            
            {book.publisher && (
              <Typography variant="body2" gutterBottom>
                <strong>Nhà xuất bản:</strong> {book.publisher}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Mô tả
            </Typography>
            
            <Typography variant="body1" paragraph>
              {book.description || "Không có mô tả."}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBorrow}
                disabled={book.availableCopies <= 0}
              >
                {book.availableCopies > 0 ? 'Mượn Sách' : 'Hết Sách'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default BookDetailPage;