import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { RegisterFormData } from "../../types/auth.types";
import { ApiError } from "../../types/error.types";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData & { confirmPassword: string }>();

  const password = watch("password", "");

  const handleFormSubmit = async (
    data: RegisterFormData & { confirmPassword: string }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Loại bỏ confirmPassword trước khi gửi data
      // Tạo một đối tượng mới không chứa confirmPassword
      const registerData = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      await onSubmit(registerData);
    } catch (err: unknown) {
      // Xử lý lỗi một cách an toàn với kiểu dữ liệu
      if (err && typeof err === "object" && "response" in err) {
        const apiError = err as ApiError;
        setError(
          apiError.response?.data?.message ||
            "Đăng ký thất bại. Vui lòng thử lại."
        );
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="mb-0 space-y-6"
      >
        <h1 className="text-xl font-bold text-gray-900 text-center">
          Đăng Ký Tài Khoản
        </h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div>
          <Input
            label="Tên đăng nhập"
            {...register("username", {
              required: "Vui lòng nhập tên đăng nhập",
              minLength: {
                value: 3,
                message: "Tên đăng nhập phải có ít nhất 3 ký tự",
              },
              maxLength: {
                value: 50,
                message: "Tên đăng nhập không được vượt quá 50 ký tự",
              },
            })}
            error={errors.username?.message}
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            {...register("email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            })}
            error={errors.email?.message}
            placeholder="Nhập email"
          />
        </div>

        <div>
          <Input
            label="Mật khẩu"
            type="password"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
              maxLength: {
                value: 50,
                message: "Mật khẩu không được vượt quá 50 ký tự",
              },
            })}
            error={errors.password?.message}
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div>
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu",
              validate: (value) =>
                value === password || "Mật khẩu xác nhận không khớp",
            })}
            error={errors.confirmPassword?.message}
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Đăng Ký
          </Button>
        </div>

        <div className="text-sm text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
