import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col justify-center items-center py-12">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Trang không tồn tại</h2>
          <p className="text-gray-600 mt-2">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không có sẵn.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;