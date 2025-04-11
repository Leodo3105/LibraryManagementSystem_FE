import React, { useState, useEffect } from 'react';
import { Book, Category, BookCreateDto } from '../../types/book.types';
import { createBook, updateBook, uploadImage } from '../../api/bookApi';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Grid, Typography, Box, IconButton, Alert
} from '@mui/material';
import { PhotoCamera, Close as CloseIcon } from '@mui/icons-material';

interface BookFormDialogProps {
  open: boolean;
  onClose: () => void;
  book: Book | null;
  categories: Category[];
  onSave: (book: Book) => void;
}

const BookFormDialog: React.FC<BookFormDialogProps> = ({
  open,
  onClose,
  book,
  categories,
  onSave
}) => {
  const [formData, setFormData] = useState<BookCreateDto>({
    title: '',
    author: '',
    isbn: '',
    publicationYear: undefined,
    publisher: '',
    totalCopies: 1,
    categoryId: 0,
    coverImageUrl: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        publicationYear: book.publicationYear,
        publisher: book.publisher || '',
        totalCopies: book.totalCopies,
        categoryId: book.categoryId,
        coverImageUrl: book.coverImageUrl || '',
        description: book.description || ''
      });
      setPreviewUrl(book.coverImageUrl || '');
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publicationYear: undefined,
        publisher: '',
        totalCopies: 1,
        categoryId: categories.length > 0 ? categories[0].id : 0,
        coverImageUrl: '',
        description: ''
      });
      setPreviewUrl('');
    }
    
    setErrors({});
    setError('');
    setSelectedFile(null);
  }, [book, categories, open]);
  
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
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? undefined : parseInt(value);
    setFormData(prev => ({ ...prev, [name]: numberValue }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setFormData(prev => ({ ...prev, categoryId: e.target.value as number }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, coverImageUrl: '' }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề sách';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Vui lòng nhập tên tác giả';
    }
    
    if (formData.publicationYear && (formData.publicationYear < 0 || formData.publicationYear > new Date().getFullYear())) {
      newErrors.publicationYear = 'Năm xuất bản không hợp lệ';
    }
    
    if (formData.totalCopies <= 0) {
      newErrors.totalCopies = 'Số lượng sách phải lớn hơn 0';
    }
    
    if (formData.categoryId === 0) {
      newErrors.categoryId = 'Vui lòng chọn thể loại';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Upload image if selected
      let imageUrl = formData.coverImageUrl;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }
      
      const bookData = {
        ...formData,
        coverImageUrl: imageUrl
      };
      
      // Create or update book
      let response;
      if (book) {
        response = await updateBook(book.id, bookData);
      } else {
        response = await createBook(bookData);
      }
      
      onSave(response);
    } catch (err: any) {
      console.error('Error saving book:', err);
      setError(err.response?.data?.message || 'Không thể lưu sách. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{book ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới'}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          {/* Left side - Book details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Tiêu đề sách"
                  fullWidth
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="author"
                  label="Tác giả"
                  fullWidth
                  value={formData.author}
                  onChange={handleChange}
                  error={!!errors.author}
                  helperText={errors.author}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="isbn"
                  label="ISBN"
                  fullWidth
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="publicationYear"
                  label="Năm xuất bản"
                  type="number"
                  fullWidth
                  value={formData.publicationYear || ''}
                  onChange={handleNumberChange}
                  error={!!errors.publicationYear}
                  helperText={errors.publicationYear}
                  inputProps={{ min: 0, max: new Date().getFullYear() }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="publisher"
                  label="Nhà xuất bản"
                  fullWidth
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="totalCopies"
                  label="Tổng số bản sao"
                  type="number"
                  fullWidth
                  value={formData.totalCopies}
                  onChange={handleNumberChange}
                  error={!!errors.totalCopies}
                  helperText={errors.totalCopies}
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel>Thể loại</InputLabel>
                  <Select
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    label="Thể loại"
                    required
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography variant="caption" color="error">
                      {errors.categoryId}
                    </Typography>
                  )}
                </FormControl>
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
                />
              </Grid>
            </Grid>
          </Grid>
          
          {/* Right side - Cover image */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Ảnh bìa sách
            </Typography>
            
            <Box 
              sx={{ 
                border: '1px dashed #ccc', 
                borderRadius: 1, 
                py: 2, 
                px: 1, 
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {previewUrl ? (
                <>
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    <IconButton 
                      size="small" 
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                      onClick={clearImage}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Book cover preview"
                      sx={{ 
                        width: '100%',
                        maxHeight: 280,
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </>
              ) : (
                <Typography color="text.secondary" align="center">
                  Chưa có ảnh bìa
                </Typography>
              )}
              
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                sx={{ mt: 2 }}
              >
                {previewUrl ? 'Đổi ảnh' : 'Tải ảnh lên'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
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

export default BookFormDialog;