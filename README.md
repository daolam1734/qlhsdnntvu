# Hệ thống Quản lý Hồ sơ Đi Nước Ngoài - Trường Đại học Trà Vinh
# Travel Records Management System - Tra Vinh University

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng chính](#-tính-năng-chính)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [Cấu trúc cơ sở dữ liệu](#-cấu-trúc-cơ-sở-dữ-liệu)
- [API Documentation](#-api-documentation)
- [UI Flow & Components](#-ui-flow--components)
- [LoginPage Component](#-loginpage-component)
- [Phân quyền](#-phân-quyền)
- [Testing](#-testing)
- [Monitoring](#-monitoring)
- [Deployment](#-deployment)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

## 🎯 Tổng quan

Hệ thống quản lý hồ sơ đi nước ngoài cho viên chức tại Trường Đại học Trà Vinh, được xây dựng với kiến trúc full-stack hiện đại, đảm bảo tính bảo mật cao và trải nghiệm người dùng tốt.

### Mục tiêu
- Quản lý toàn bộ quy trình từ đăng ký đến hoàn tất hồ sơ đi nước ngoài
- Đảm bảo tuân thủ quy định của nhà trường và pháp luật
- Tối ưu hóa quy trình phê duyệt và ban hành quyết định
- Cung cấp báo cáo và thống kê chi tiết

## ✨ Tính năng chính

### 👤 Quản lý người dùng
- Đăng nhập/đăng xuất với JWT
- Phân quyền dựa trên vai trò (RBAC)
- Quản lý thông tin cá nhân

### 📄 Quản lý hồ sơ
- Tạo hồ sơ đi nước ngoài
- Upload tài liệu đính kèm
- Theo dõi trạng thái hồ sơ
- Lịch sử thay đổi

### ✅ Quy trình phê duyệt
- Phê duyệt theo cấp (Đơn vị → Chi bộ → Đảng ủy → TCHC → BGH)
- Thông báo real-time
- Ghi nhận ý kiến phê duyệt

### 📋 Ban hành quyết định
- Tạo quyết định đi nước ngoài
- Upload quyết định PDF
- Lưu trữ và tra cứu

### 📊 Báo cáo và thống kê
- Thống kê theo đơn vị, thời gian
- Báo cáo tổng hợp
- Xuất báo cáo Excel/PDF

### 🔒 Bảo mật
- Mã hóa dữ liệu nhạy cảm
- Row Level Security (RLS)
- Audit trail cho tất cả thao tác

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Components    │    │ - Controllers   │    │ - 36 Tables     │
│ - Pages         │    │ - Services      │    │ - Triggers      │
│ - Hooks         │    │ - Guards        │    │ - RLS Policies  │
│ - Utils         │    │ - Interceptors  │    │ - Indexes       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend Architecture
```
src/
├── auth/                 # Authentication module
├── records/              # Records management
├── catalogs/             # Catalogs (countries, purposes)
├── reports/              # Reports & statistics
├── common/               # Shared utilities
│   ├── guards/           # JWT, Roles guards
│   ├── decorators/       # @Roles, @Permissions
│   ├── interceptors/     # Response formatting
│   ├── filters/          # Exception filters
│   └── base.service.ts   # Base service with transactions
├── config/               # Configuration
└── app.module.ts
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: OpenAPI/Swagger

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Ant Design
- **HTTP Client**: Axios

### Database
- **PostgreSQL 15+**
- **Extensions**: uuid-ossp, pgcrypto
- **Features**: Triggers, RLS, Indexes

### DevOps
- **Version Control**: Git
- **Container**: Docker
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- PostgreSQL 15+
- npm hoặc yarn

### 1. Clone repository
```bash
git clone https://github.com/your-org/qlhs-dnn-tvu.git
cd qlhs-dnn-tvu
```

### 2. Cài đặt dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Thiết lập database
```bash
# Tạo database
createdb qlhs_dnn_tvu

# Chạy migration
cd backend
npm run migration:run

# Seed data
npm run seed
```

### 4. Cấu hình environment
```bash
# Backend
cp backend/.env.example backend/.env
# Edit .env with your database credentials

# Frontend
cp frontend/.env.example frontend/.env
```

### 5. Chạy ứng dụng
```bash
# Backend (Terminal 1)
cd backend
npm run start:dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### 6. Truy cập
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

## 🗄️ Cấu trúc cơ sở dữ liệu

### Sơ đồ tổng quan
```
Users (Người dùng)
├── VienChuc (Viên chức)
├── Roles (Vai trò)
└── Departments (Đơn vị)

Records (Hồ sơ)
├── HoSoDiNuocNgoai (Hồ sơ chính)
├── PheDuyet (Phê duyệt)
├── QuyetDinh (Quyết định)
├── BaoCao (Báo cáo)
└── Attachments (Tài liệu đính kèm)

Catalogs (Danh mục)
├── Countries (Quốc gia)
├── Purposes (Mục đích)
├── Currencies (Tiền tệ)
└── ExpenseTypes (Loại chi phí)
```

### Chi tiết 36 bảng
- **Tổ chức nhân sự**: 7 bảng (departments, users, roles, etc.)
- **Hồ sơ**: 3 bảng (records, attachments, reports)
- **Phê duyệt workflow**: 6 bảng (approvals, workflow steps, etc.)
- **Đảng viên**: 3 bảng (party organizations, party members, etc.)
- **Quyết định văn thư**: 4 bảng (decision types, documents, etc.)
- **Danh mục**: 5 bảng (countries, purposes, statuses, etc.)
- **Bảo mật hệ thống**: 8 bảng (logs, settings, notifications, etc.)

## 📚 API Documentation

### Authentication
```http
POST /auth/login
Content-Type: application/json

{
  "username": "vc001",
  "password": "password"
}
```

### Records Management
```http
GET /records?page=1&limit=10&status=PENDING
POST /records
PUT /records/{id}
POST /records/{id}/approve
```

### Chi tiết API
- **OpenAPI Spec**: `backend/openapi-spec.yaml`
- **Swagger UI**: `/api/docs`
- **RBAC Mapping**: `backend/RBAC_Mapping.md`

## 🎨 UI Flow & Components

### State-Driven UI Design
Hệ thống UI được thiết kế theo nguyên tắc **State-Driven UI** - chỉ hiển thị actions hợp lệ dựa trên:
- **Trạng thái hiện tại** của hồ sơ
- **Vai trò** của người dùng
- **Quyền hạn** được phân quyền

### UI Flow Documentation
- **UI Flow Specification**: `UI_Flow_Specification.md`
- **React Components**: `React_Components_Example.md`
- **Implementation Summary**: `UI_Flow_Implementation_Summary.md`

### Key Features
- ✅ **Permission-based rendering** - Actions chỉ hiển thị khi có quyền
- ✅ **State-based workflows** - UI thay đổi theo trạng thái hồ sơ
- ✅ **Responsive design** - Tương thích mọi thiết bị
- ✅ **Real-time updates** - Cập nhật trạng thái tức thời

## 🔐 LoginPage Component

### 🎯 Trang đăng nhập hệ thống
Component `LoginPage` được thiết kế chuyên nghiệp cho hệ thống hành chính với đầy đủ tính năng bảo mật.

### ✨ Tính năng chính
- ✅ **Layout 2 cột responsive** - Logo + tên hệ thống | Form đăng nhập
- ✅ **Form validation** - Kiểm tra dữ liệu đầu vào
- ✅ **Password visibility toggle** - Xem/ẩn mật khẩu
- ✅ **Remember me** - Ghi nhớ username (localStorage)
- ✅ **Forgot password link** - Điều hướng /quen-mat-khau
- ✅ **Loading states** - Hiển thị trạng thái đang xử lý
- ✅ **Error handling** - Thông báo lỗi không phân biệt loại
- ✅ **Auto redirect** - Chuyển hướng sau đăng nhập thành công

### 📁 Files
- **Component**: `frontend/src/pages/LoginPage.jsx`
- **Styling**: `frontend/src/pages/LoginPage.css`
- **Documentation**: `frontend/src/pages/LoginPage.README.md`
- **Demo**: `frontend/demo-login.html`

### 🚀 Demo
Mở file `frontend/demo-login.html` trong browser để xem demo hoạt động.

### 🔧 Dependencies
```json
{
  "react": "^18.0.0",
  "antd": "^5.0.0",
  "@ant-design/icons": "^5.0.0"
}
```

## 🔐 Phân quyền

### Vai trò hệ thống
1. **VIEN_CHUC** - Viên chức (người dùng thông thường)
2. **TRUONG_DON_VI** - Trưởng đơn vị
3. **CHI_BO** - Chi bộ Đảng
4. **DANG_UY** - Đảng ủy
5. **TCHC** - Phòng Tổ chức Hành chính
6. **BGH** - Ban Giám hiệu

### Ma trận phân quyền
| Quyền | VIEN_CHUC | TRUONG_DON_VI | CHI_BO | DANG_UY | TCHC | BGH |
|-------|-----------|---------------|--------|---------|------|-----|
| Tạo hồ sơ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Phê duyệt | ❌ | Cấp 1 | Đảng | Đảng | Cấp 4 | Cấp 5 |
| Ban hành QĐ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Xem báo cáo | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

## 🧪 Testing

### Unit Tests
```bash
cd backend
npm run test
```

### E2E Tests
```bash
cd backend
npm run test:e2e
```

### Integration Tests
```bash
cd frontend
npm run test
```

## 📊 Monitoring

### Health Checks
- **Database**: `GET /health/database`
- **Application**: `GET /health/app`
- **Memory**: `GET /health/memory`

### Metrics
- Response times
- Error rates
- User activity
- Database performance

## 🚀 Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qlhs_dnn_tvu
DB_USER=postgres
DB_PASS=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# App
NODE_ENV=production
PORT=3001
```

## 🤝 Đóng góp

### Quy trình
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Coding Standards
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Testing**: 80%+ coverage required
- **Documentation**: JSDoc comments required

## 📄 Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Project Manager**: [Tên PM]
- **Technical Lead**: [Tên Tech Lead]
- **Email**: contact@tvuni.edu.vn
- **Phone**: +84 xxx xxx xxxx

---

**Trường Đại học Trà Vinh** - Khoa Công nghệ Thông tin
*Được phát triển bởi đội ngũ CNTT TVU*