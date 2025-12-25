import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Spin } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import './styles/global.css'; // Import global styles

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import { routes } from './routes';
import { useAuth } from './hooks';

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <Spin size="large" />
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children, requiresAuth, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App component
function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
      locale={{
        locale: 'vi_VN', // Vietnamese locale if available
      }}
    >
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {routes.map((route) => {
              const Layout = route.layout === 'auth' ? AuthLayout : MainLayout;
              const Component = route.component;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRoute
                      requiresAuth={route.requiresAuth}
                      roles={route.roles}
                    >
                      <Layout>
                        <Component />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </Router>
    </ConfigProvider>
  );
}

export default App;
