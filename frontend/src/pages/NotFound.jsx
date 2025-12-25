// src/pages/NotFound.jsx
// 404 Not Found page component

import React from 'react';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
      extra={
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      }
    />
  );
};

export default NotFound;