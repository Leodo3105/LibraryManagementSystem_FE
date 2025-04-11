import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUsers, updateUserRole } from '../../api/adminApi';
import { User } from '../../types/user.types';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Box, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, InputLabel, Select, MenuItem, Alert,
  SelectChangeEvent
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for role edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleRoleChange = (event: SelectChangeEvent) => {
    setNewRole(event.target.value);
  };
  
  const handleUpdateRole = async () => {
    if (!selectedUser || newRole === selectedUser.role) {
      setDialogOpen(false);
      return;
    }
    
    try {
      await updateUserRole(selectedUser.id, newRole);
      
      // Update the user in the list
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole } 
          : user
      ));
      
      setSuccessMessage(`Vai trò của người dùng "${selectedUser.username}" đã được cập nhật thành ${getRoleLabel(newRole)}`);
      setDialogOpen(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Error updating user role:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật vai trò. Vui lòng thử lại sau.');
      setDialogOpen(false);
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'primary';
      case 'User': return 'default';
      default: return 'default';
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'Admin': return 'Quản trị viên';
      case 'User': return 'Người dùng';
      default: return role;
    }
  };
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản Lý Người Dùng
        </Typography>
        
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
        
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : users.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Không có người dùng nào</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên người dùng</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.username}
                      {currentUser?.id === user.id && (
                        <Typography component="span" color="primary" sx={{ ml: 1, fontSize: '0.75rem' }}>
                          (Bạn)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getRoleLabel(user.role)} 
                        color={getRoleColor(user.role) as any} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {/* Prevent changing your own role */}
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditRole(user)}
                        aria-label="Sửa vai trò"
                        disabled={currentUser?.id === user.id}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Role Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Thay đổi vai trò người dùng</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box sx={{ py: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Người dùng:</strong> {selectedUser.username}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Vai trò hiện tại:</strong>{' '}
                  <Chip 
                    label={getRoleLabel(selectedUser.role)} 
                    color={getRoleColor(selectedUser.role) as any} 
                    size="small" 
                  />
                </Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vai trò mới</InputLabel>
                  <Select
                    value={newRole}
                    onChange={handleRoleChange}
                    label="Vai trò mới"
                  >
                    <MenuItem value="Admin">Quản trị viên</MenuItem>
                    <MenuItem value="User">Người dùng</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button 
              onClick={handleUpdateRole} 
              variant="contained" 
              color="primary"
              disabled={!selectedUser || newRole === selectedUser?.role}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default AdminUsersPage;