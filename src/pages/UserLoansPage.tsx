import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getUserLoans, updateBookLoan } from '../api/bookLoanApi';
import { BookLoan } from '../types/bookLoan.types';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, Box, Alert, Pagination
} from '@mui/material';

const UserLoansPage: React.FC = () => {
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await getUserLoans({ page, pageSize });
        setLoans(response);
        
        // Lấy thông tin phân trang từ headers
        const totalItems = parseInt(response.headers['x-pagination-totalitems'] || '0');
        setTotalPages(Math.ceil(totalItems / pageSize));
      } catch (err) {
        console.error('Lỗi khi lấy danh sách phiếu mượn:', err);
        setError('Không thể tải danh sách phiếu mượn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoans();
  }, [page, pageSize]);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const handleReturnBook = async (id: number) => {
    try {
      await updateBookLoan(id, { status: 'Returned' });
      setActionSuccess('Sách đã được đánh dấu là trả thành công!');
      setActionError('');
      
      // Cập nhật lại danh sách phiếu mượn
      const updatedLoans = loans.map(loan => 
        loan.id === id ? { ...loan, status: 'Returned', returnDate: new Date().toISOString() } : loan
      );
      setLoans(updatedLoans);
    } catch (err: any) {
      console.error('Lỗi khi trả sách:', err);
      setActionError(err.response?.data?.message || 'Không thể trả sách. Vui lòng thử lại sau.');
      setActionSuccess('');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'info';
      case 'Rejected': return 'error';
      case 'Returned': return 'success';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending': return 'Chờ duyệt';
      case 'Approved': return 'Đã duyệt';
      case 'Rejected': return 'Từ chối';
      case 'Returned': return 'Đã trả';
      case 'Overdue': return 'Quá hạn';
      default: return status;
    }
  };
  
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sách Đã Mượn
        </Typography>
        
        {actionSuccess && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionSuccess('')}>
            {actionSuccess}
          </Alert>
        )}
        
        {actionError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setActionError('')}>
            {actionError}
          </Alert>
        )}
        
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {loans.length === 0 ? (
              <Paper sx={{ p: 3 }}>
                <Typography align="center">
                  Bạn chưa có phiếu mượn nào.
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/books"
                  >
                    Xem Danh Sách Sách
                  </Button>
                </Box>
              </Paper>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên Sách</TableCell>
                        <TableCell>Ngày Mượn</TableCell>
                        <TableCell>Hạn Trả</TableCell>
                        <TableCell>Trạng Thái</TableCell>
                        <TableCell>Thao Tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loans.map(loan => (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <Link to={`/books/${loan.bookId}`}>
                              {loan.bookTitle}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {new Date(loan.borrowDate).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            {new Date(loan.dueDate).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusLabel(loan.status)} 
                              color={getStatusColor(loan.status) as any} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            {(loan.status === 'Approved' || loan.status === 'Overdue') && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleReturnBook(loan.id)}
                              >
                                Trả Sách
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Phân trang */}
                {totalPages > 1 && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={handlePageChange} 
                      color="primary" 
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default UserLoansPage;