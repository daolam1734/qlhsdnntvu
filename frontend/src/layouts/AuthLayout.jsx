// src/layouts/AuthLayout.jsx
// Layout for authentication pages (login, etc.)

import React from 'react';
import { Layout } from 'antd';
import { APP_CONFIG } from '../config';

const { Content } = Layout;

const AuthLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f0f2f5',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '32px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: '#262626', marginBottom: '8px' }}>
              {APP_CONFIG.name}
            </h2>
            <p style={{ color: '#8c8c8c' }}>
              Hệ thống quản lý hồ sơ đi công tác
            </p>
          </div>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;