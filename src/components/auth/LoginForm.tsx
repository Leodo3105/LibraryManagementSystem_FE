import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { LoginFormData } from '../../types/auth.types';
import { ApiError } from '../../types/error.types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  
  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
        await onSubmit(data);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const apiError = err as ApiError;
          setError(apiError.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } else {
          setError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
      }
  };
  
  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-0 space-y-6">
        <h1 className="text-xl font-bold text-gray-900 text-center">Đăng Nhập</h1>
        
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        
        <div>
          <Input
            label="Tên đăng nhập"
            {...register('username', {
              required: 'Vui lòng nhập tên đăng nhập',
            })}
            error={errors.username?.message}
            placeholder="Nhập tên đăng nhập"
          />
        </div>
        
        <div>
          <Input
            label="Mật khẩu"
            type="password"
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
            })}
            error={errors.password?.message}
            placeholder="Nhập mật khẩu"
          />
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Đăng Nhập
          </Button>
        </div>
        
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;