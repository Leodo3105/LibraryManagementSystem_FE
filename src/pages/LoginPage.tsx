import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import Layout from '../components/layout/Layout'; // Import your existing Layout component
import { LoginFormData } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated, redirect to home page
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async (data: LoginFormData) => {
    await login(data);
    navigate('/');
  };

  return (
    <Layout>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          
          {/* Login Form */}
          <Box component="form" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = {
              username: formData.get('username') as string,
              password: formData.get('password') as string,
            };
            handleLogin(data);
          }} sx={{ width: '100%' }}>
            
            <TextField
              label="Username"
              name="username"
              fullWidth
              required
              margin="normal"
            />
            
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              margin="normal"
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default LoginPage;
