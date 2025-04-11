import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ 
            flexGrow: 1, 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Thư Viện Mini
        </Typography>

        {/* Desktop menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button 
            component={RouterLink} 
            to="/" 
            color="inherit"
          >
            Trang Chủ
          </Button>
          <Button 
            component={RouterLink} 
            to="/books" 
            color="inherit"
          >
            Danh Sách Sách
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                component={RouterLink}
                to="/my-loans"
                color="inherit"
              >
                Sách Đã Mượn
              </Button>
              {isAdmin && (
                <Button
                  component={RouterLink}
                  to="/admin/dashboard"
                  color="inherit"
                >
                  Quản Trị
                </Button>
              )}
              <Typography 
                variant="body1" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mx: 1 
                }}
              >
                Xin chào, {user?.username}
              </Typography>
              <Button 
                color="secondary" 
                variant="contained"
                onClick={handleLogout}
              >
                Đăng Xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
              >
                Đăng Nhập
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
              >
                Đăng Ký
              </Button>
            </>
          )}
        </Box>

        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemText primary="Trang Chủ" />
            </ListItem>
            <ListItem button component={RouterLink} to="/books">
              <ListItemText primary="Danh Sách Sách" />
            </ListItem>

            {isAuthenticated && (
              <ListItem button component={RouterLink} to="/my-loans">
                <ListItemText primary="Sách Đã Mượn" />
              </ListItem>
            )}

            {isAdmin && (
              <ListItem button component={RouterLink} to="/admin/dashboard">
                <ListItemText primary="Quản Trị" />
              </ListItem>
            )}
          </List>

          <Divider />

          <List>
            {isAuthenticated ? (
              <>
                <ListItem>
                  <ListItemText 
                    primary={`Xin chào, ${user?.username}`}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Đăng Xuất" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={RouterLink} to="/login">
                  <ListItemText primary="Đăng Nhập" />
                </ListItem>
                <ListItem button component={RouterLink} to="/register">
                  <ListItemText primary="Đăng Ký" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;