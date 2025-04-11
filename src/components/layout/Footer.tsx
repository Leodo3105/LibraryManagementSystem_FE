import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Thư Viện Mini
            </Typography>
            <Typography variant="body2">
              Hệ thống quản lý thư viện đơn giản
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Link href="#" color="inherit" underline="hover">
                  Liên Hệ
                </Link>
              </Grid>
              <Grid item xs={4}>
                <Link href="#" color="inherit" underline="hover">
                  Điều Khoản Sử Dụng
                </Link>
              </Grid>
              <Grid item xs={4}>
                <Link href="#" color="inherit" underline="hover">
                  Chính Sách Bảo Mật
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        <Typography variant="body2" align="center">
          &copy; {currentYear} Thư Viện Mini. Tất cả quyền được bảo lưu.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;