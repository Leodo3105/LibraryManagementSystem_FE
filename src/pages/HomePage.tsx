import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import UpdateIcon from '@mui/icons-material/Update';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'primary.main',
          color: '#fff',
          mb: 4,
          py: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="h1" variant="h3" gutterBottom>
              Chào Mừng Đến Với Thư Viện Mini
            </Typography>
            <Typography variant="h6" paragraph>
              Hệ thống quản lý thư viện đơn giản, giúp bạn dễ dàng tìm kiếm, mượn và quản lý sách.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/books"
                variant="contained"
                color="secondary"
                size="large"
              >
                Xem Sách
              </Button>
              {!isAuthenticated && (
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  size="large"
                >
                  Đăng Ký Ngay
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Features section */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Tính Năng Chính
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LibraryBooksIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6" component="h3">
                    Thư Viện Sách
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Khám phá kho tàng sách đa dạng từ nhiều thể loại khác nhau.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/books" 
                  color="primary"
                  endIcon={<LibraryBooksIcon />}
                >
                  Xem Sách
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SearchIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6" component="h3">
                    Tìm Kiếm Thông Minh
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Tìm kiếm sách theo tên, tác giả hoặc thể loại một cách dễ dàng.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/books" 
                  color="primary"
                  endIcon={<SearchIcon />}
                >
                  Tìm Kiếm
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BookmarkIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6" component="h3">
                    Quản Lý Mượn Sách
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Theo dõi sách bạn đang mượn và lịch sử mượn trả một cách hiệu quả.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to={isAuthenticated ? "/my-loans" : "/login"} 
                  color="primary"
                  endIcon={<BookmarkIcon />}
                >
                  {isAuthenticated ? "Sách Đã Mượn" : "Đăng Nhập"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Why choose us section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, borderRadius: 2 }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Tại Sao Chọn Thư Viện Mini?
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', display: 'flex' }}>
                <SpeedIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Dễ Dàng Sử Dụng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giao diện thân thiện, dễ sử dụng cho cả người quản lý và độc giả.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', display: 'flex' }}>
                <UpdateIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Cập Nhật Thời Gian Thực
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Theo dõi trạng thái sách và đơn mượn/trả một cách nhanh chóng.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', display: 'flex' }}>
                <SecurityIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Bảo Mật Cao
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn cao nhất.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;