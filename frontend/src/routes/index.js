// src/routes/index.js
// Route configuration

import { lazy } from 'react';

// Lazy load components for better performance
const LoginPage = lazy(() => import('../pages/LoginPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const RecordsList = lazy(() => import('../pages/RecordsList'));
const RecordDetail = lazy(() => import('../pages/RecordDetail'));
const CreateRecord = lazy(() => import('../pages/CreateRecord'));
const Approvals = lazy(() => import('../pages/Approvals'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Route definitions
export const routes = [
  {
    path: '/login',
    component: LoginPage,
    layout: 'auth',
    title: 'Đăng nhập',
    requiresAuth: false,
  },
  {
    path: '/',
    component: Dashboard,
    layout: 'main',
    title: 'Bảng điều khiển',
    requiresAuth: true,
    roles: ['admin', 'manager', 'employee'],
  },
  {
    path: '/records',
    component: RecordsList,
    layout: 'main',
    title: 'Danh sách hồ sơ',
    requiresAuth: true,
    roles: ['admin', 'manager', 'employee'],
  },
  {
    path: '/records/:id',
    component: RecordDetail,
    layout: 'main',
    title: 'Chi tiết hồ sơ',
    requiresAuth: true,
    roles: ['admin', 'manager', 'employee'],
  },
  {
    path: '/records/create',
    component: CreateRecord,
    layout: 'main',
    title: 'Tạo hồ sơ mới',
    requiresAuth: true,
    roles: ['admin', 'manager', 'employee'],
  },
  {
    path: '/approvals',
    component: Approvals,
    layout: 'main',
    title: 'Duyệt hồ sơ',
    requiresAuth: true,
    roles: ['admin', 'manager'],
  },
  {
    path: '/profile',
    component: Profile,
    layout: 'main',
    title: 'Thông tin cá nhân',
    requiresAuth: true,
    roles: ['admin', 'manager', 'employee'],
  },
  {
    path: '*',
    component: NotFound,
    layout: 'auth',
    title: 'Không tìm thấy',
    requiresAuth: false,
  },
];

// Route helpers
export const routeHelpers = {
  getRouteByPath: (path) => routes.find(route => route.path === path),
  getRoutesByLayout: (layout) => routes.filter(route => route.layout === layout),
  getRoutesByRole: (role) => routes.filter(route => !route.roles || route.roles.includes(role)),
  isRouteAllowed: (route, userRole) => !route.roles || route.roles.includes(userRole),
};