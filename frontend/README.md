# Frontend - Hệ thống Quản lý Hồ sơ Đi Công Tác

## Tổng quan

Frontend của hệ thống quản lý hồ sơ đi công tác tại Trường Đại học Trà Vinh, được xây dựng bằng React 18 với Ant Design UI library.

## Công nghệ sử dụng

- **React 18** - Framework JavaScript
- **Vite** - Build tool và dev server
- **Ant Design** - UI component library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Validation
- **Day.js** - Date utilities
- **clsx** - Class utilities

## Cấu trúc thư mục

```
src/
├── assets/            # Static assets (images, icons)
├── components/        # Reusable UI components
├── pages/             # Page-level components
├── layouts/           # Layout components (Auth, Main)
├── modules/           # Business logic modules
├── services/          # API services
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── constants/         # App constants and enums
├── routes/            # Route configuration
├── styles/            # Global styles
└── config/            # App configuration
```

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js ≥ 18 LTS
- npm hoặc pnpm

### Cài đặt dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Cấu hình

### Biến môi trường

Tạo file `.env` trong thư mục root với các biến sau:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_API_TIMEOUT=10000

# Application Configuration
REACT_APP_APP_NAME=QLHS_DNN_TVU
REACT_APP_VERSION=1.0.0

# Authentication
REACT_APP_JWT_SECRET_KEY=your-secret-key-here
REACT_APP_TOKEN_EXPIRE_TIME=3600000

# Development
REACT_APP_DEBUG=true
```

### Cấu hình Ant Design

Theme và locale được cấu hình trong `src/App.jsx`:

```jsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
  locale={{
    locale: 'vi_VN',
  }}
>
```

## Routing

Ứng dụng sử dụng React Router với cấu hình trong `src/routes/index.js`:

- `/login` - Trang đăng nhập
- `/` - Dashboard
- `/records` - Danh sách hồ sơ
- `/records/:id` - Chi tiết hồ sơ
- `/records/create` - Tạo hồ sơ mới
- `/approvals` - Duyệt hồ sơ
- `/profile` - Thông tin cá nhân

## Authentication & Authorization

- Sử dụng JWT token cho authentication
- Role-based access control (RBAC)
- Protected routes dựa trên trạng thái đăng nhập và quyền

## API Integration

Axios được cấu hình trong `src/services/api.js` với:

- Base URL từ environment variables
- Request/Response interceptors
- Automatic token attachment
- Error handling

## Styling

- CSS Modules cho component-specific styles
- Global styles trong `src/styles/global.css`
- Responsive design với Ant Design Grid system
- Accessibility considerations

## Development Guidelines

### Không viết logic nghiệp vụ trong page

- Page components chỉ nên chứa UI logic
- Business logic nên được tách ra thành modules trong `src/modules/`
- Sử dụng custom hooks cho logic có thể tái sử dụng

### Component Structure

```jsx
// components/MyComponent.jsx
import React from 'react';
import styles from './MyComponent.module.css';

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### Custom Hooks

```jsx
// hooks/useCustomHook.js
import { useState, useEffect } from 'react';

export const useCustomHook = (param) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Hook logic
  }, [param]);

  return { state, setState };
};
```

## Testing

```bash
npm run test
```

## Deployment

1. Build production version:
   ```bash
   npm run build
   ```

2. Deploy thư mục `dist` lên web server

3. Cấu hình environment variables trên production server

## Browser Support

- Chrome ≥ 90
- Firefox ≥ 88
- Safari ≥ 14
- Edge ≥ 90

## Contributing

1. Tạo feature branch từ `main`
2. Implement changes
3. Test thoroughly
4. Create pull request

## License

Internal use only - Trường Đại học Trà Vinh
