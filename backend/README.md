# Backend - Hệ thống Quản lý Hồ sơ Đi Công Tác

## Tổng quan

Backend API cho hệ thống quản lý hồ sơ đi công tác tại Trường Đại học Trà Vinh, được xây dựng bằng Node.js và Express.js với PostgreSQL.

## Công nghệ sử dụng

- **Node.js ≥ 18 LTS** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Joi** - Request validation
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Day.js** - Date utilities

## Cấu trúc thư mục

```
src/
├── app.js                 # Khởi tạo Express app
├── server.js              # Khởi động server
├── config/
│   ├── env.js             # Load biến môi trường
│   ├── database.js        # Kết nối PostgreSQL
│   └── logger.js          # Cấu hình Winston logger
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js    # Xử lý request/response
│   │   ├── auth.service.js       # Logic nghiệp vụ
│   │   ├── auth.route.js         # Định tuyến
│   │   └── auth.schema.js        # Validation schemas
│   ├── nguoi-dung/        # User management
│   ├── ho-so/            # Record management
│   ├── phe-duyet/         # Approval management
│   └── quyet-dinh/        # Decision management
├── middlewares/
│   ├── auth.middleware.js        # JWT authentication
│   ├── role.middleware.js        # Role-based authorization
│   ├── validation.middleware.js  # Request validation
│   └── error.middleware.js       # Error handling
├── routes/
│   └── index.js           # Main routes
├── utils/                 # Utility functions
├── constants/             # Application constants
└── tests/                 # Unit tests
```

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js ≥ 18.0.0
- PostgreSQL ≥ 12
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình biến môi trường

Tạo file `.env` trong thư mục root:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qlhs_dnn_tvu
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE_TIME=3600000
JWT_REFRESH_SECRET=your-refresh-token-secret-here
JWT_REFRESH_EXPIRE_TIME=604800000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Thiết lập cơ sở dữ liệu

1. Tạo database PostgreSQL
2. Chạy script tạo bảng và dữ liệu mẫu từ thư mục `../database/`

### Khởi động server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /auth/login
Đăng nhập và nhận JWT tokens.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123",
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "name": "Administrator",
      "role": "admin",
      "department": "ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/refresh-token
Làm mới access token.

#### GET /auth/me
Lấy thông tin user hiện tại.

#### PUT /auth/profile
Cập nhật thông tin cá nhân.

#### POST /auth/change-password
Đổi mật khẩu.

#### POST /auth/register (Admin only)
Đăng ký user mới.

### Error Response Format

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "username",
      "message": "Tên đăng nhập không được để trống"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Authentication & Authorization

### JWT Tokens
- **Access Token**: Hết hạn sau 1 giờ, dùng cho API calls
- **Refresh Token**: Hết hạn sau 7 ngày, dùng để lấy access token mới

### Role-based Access Control
- **admin**: Toàn quyền hệ thống
- **manager**: Quản lý phòng ban, duyệt hồ sơ
- **employee**: Tạo và xem hồ sơ của mình
- **viewer**: Chỉ xem hồ sơ

### Middleware
- `authenticate`: Kiểm tra JWT token
- `authorize`: Kiểm tra quyền truy cập
- `validateRequest`: Validate request body

## Database Schema

### Bảng chính:
- `users` - Thông tin người dùng
- `records` - Hồ sơ công tác
- `approvals` - Quy trình phê duyệt
- `departments` - Phòng ban
- `audit_logs` - Nhật ký hoạt động

Chi tiết schema xem file `../database/init.sql`

## Development Guidelines

### Service Layer Pattern
- **Controller**: Xử lý HTTP request/response
- **Service**: Chứa logic nghiệp vụ
- **Repository**: (Tùy chọn) Tương tác database thuần

### Không viết SQL trực tiếp trong Controller
```javascript
// ❌ Bad
const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

// ✅ Good - Move to service
const user = await userService.getUserById(id);
```

### Error Handling
Sử dụng `asyncHandler` wrapper:
```javascript
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(responseUtils.success(user));
});
```

### Validation
Sử dụng Joi schemas:
```javascript
const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required()
});
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Environment Variables cho Production
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build và Deploy
```bash
# Install production dependencies only
npm ci --only=production

# Start server
npm start
```

## Monitoring & Logging

- **Winston**: Structured logging với levels (error, warn, info, debug)
- **Morgan**: HTTP request logging
- **Health Check**: `GET /api/health`

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Joi schemas
- **Password Hashing**: bcrypt với 12 rounds
- **JWT**: Secure token-based authentication

## Contributing

1. Tạo feature branch từ `main`
2. Implement theo cấu trúc module
3. Viết tests cho logic mới
4. Update documentation
5. Create pull request

## License

Internal use only - Trường Đại học Trà Vinh