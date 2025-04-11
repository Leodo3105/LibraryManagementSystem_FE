import React, { useState, useEffect } from 'react';
import { Category } from '../../types/book.types';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Alert
} from '@mui/material';

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Category) => void;
}

interface CategoryFormData {
  name: string;
  description: string;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  onClose,
  category,
  onSave
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
    
    setErrors({});
    setError('');
  }, [category, open]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên thể loại';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (category) {
        // Update existing category
        response = await axios.put(`/api/categories/${category.id}`, formData);
      } else {
        // Create new category
        response = await axios.post('/api/categories', formData);
      }
      
      onSave(response.data);
    } catch (err: any) {
      console.error('Error saving category:', err);
      
      // Handle duplicate name error
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
        setErrors({ name: 'Tên thể loại đã tồn tại' });
      } else {
        setError(err.response?.data?.message || 'Không thể lưu thể loại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Chỉnh Sửa Thể Loại' : 'Thêm Thể Loại Mới'}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Tên thể loại"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Mô tả"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormDialog;