import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getDashboardStats } from '../../api/adminApi';
import { AdminDashboardStats } from '../../types/admin.types';
import {
  Container, Typography, Grid, Paper, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  Card, CardContent
} from '@mui/material';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WarningIcon from '@mui/icons-material/Warning';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Lỗi khi lấy thống kê:', err);
        setError('Không thể tải thông tin thống kê. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) return <AdminLayout><Container><Typography>Đang tải...</Typography></Container></AdminLayout>;
  if (error) return <AdminLayout><Container><Typography color="error">{error}</Typography></Container></AdminLayout>;
  if (!stats) return <AdminLayout><Container><Typography>Không có dữ liệu thống kê.</Typography></Container></AdminLayout>;
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bảng Điều Khiển Admin
          </Typography>
          <Typography color="text.secondary">
            Tổng quan về hệ thống thư viện
          </Typography>
        </Box>
        
        {/* Thống kê tổng quan */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LibraryBooksIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5">{stats.totalBooks}</Typography>
                    <Typography variant="body2" color="text.secondary">Tổng số sách</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5">{stats.totalUsers}</Typography>
                    <Typography variant="body2" color="text.secondary">Người dùng</Typography>
                    </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5">{stats.totalCategories}</Typography>
                    <Typography variant="body2" color="text.secondary">Thể loại</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BookmarkIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5">{stats.activeLoans}</Typography>
                    <Typography variant="body2" color="text.secondary">Phiếu mượn đang mở</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Báo động */}
        {stats.overdueLoans > 0 && (
          <Paper sx={{ p: 3, mb: 4, bgcolor: 'error.light' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ fontSize: 32, color: 'error.main', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="error.main">
                  Có {stats.overdueLoans} phiếu mượn đã quá hạn!
                </Typography>
                <Typography variant="body2">
                  Vui lòng kiểm tra và xử lý các phiếu mượn quá hạn.
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Button 
                  variant="contained" 
                  color="error"
                  component={Link}
                  to="/admin/loans?status=Overdue"
                >
                  Xem Ngay
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
        
        {/* Hàng chứa 2 bảng */}
        <Grid container spacing={4}>
          {/* Sách phổ biến */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Sách Được Mượn Nhiều Nhất
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên Sách</TableCell>
                      <TableCell align="right">Lượt Mượn</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.popularBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <Link to={`/admin/books/${book.id}`}>
                            {book.title}
                          </Link>
                        </TableCell>
                        <TableCell align="right">{book.loanCount}</TableCell>
                      </TableRow>
                    ))}
                    {stats.popularBooks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          {/* Sách sắp hết */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Sách Sắp Hết
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên Sách</TableCell>
                      <TableCell align="right">Có Sẵn/Tổng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.lowStockBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <Link to={`/admin/books/${book.id}`}>
                            {book.title}
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          {book.availableCopies}/{book.totalCopies}
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats.lowStockBooks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          Không có sách sắp hết
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Nút điều hướng đến các phần quản lý */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/admin/books"
            startIcon={<LibraryBooksIcon />}
          >
            Quản Lý Sách
          </Button>
          
          <Button 
            variant="contained" 
            component={Link} 
            to="/admin/categories"
            startIcon={<CategoryIcon />}
          >
            Quản Lý Thể Loại
          </Button>
          
          <Button 
            variant="contained" 
            component={Link} 
            to="/admin/loans"
            startIcon={<BookmarkIcon />}
          >
            Quản Lý Phiếu Mượn
          </Button>
          
          <Button 
            variant="contained" 
            component={Link} 
            to="/admin/users"
            startIcon={<PeopleIcon />}
          >
            Quản Lý Người Dùng
          </Button>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboardPage;