import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import Layout from '../components/layout/Layout'; // Import your existing Layout component
import { RegisterFormData } from '../types/auth.types';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated, redirect to home page
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleRegister = async (data: RegisterFormData) => {
    await register(data);
    navigate('/');
  };

  return (
    <Layout>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>
          
          {/* Register Form */}
          <Box component="form" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = {
              username: formData.get('username') as string,
              email: formData.get('email') as string,
              password: formData.get('password') as string,
              confirmPassword: formData.get('confirmPassword') as string,
            };
            handleRegister(data);
          }} sx={{ width: '100%' }}>
            
            <TextField
              label="Username"
              name="username"
              fullWidth
              required
              margin="normal"
            />
            
            <TextField
              label="Email"
              name="email"
              type="email"
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
            
            <TextField
              label="Confirm Password"
              name="confirmPassword"
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
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default RegisterPage;
