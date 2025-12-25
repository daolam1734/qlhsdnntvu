# API Specification & Role-Based Access Control
# Đặc tả API và Phân quyền cho Hệ thống QLHS_DNN_TVU

## 📋 Tổng quan

Hệ thống API RESTful cho quản lý hồ sơ đi nước ngoài với:
- **OpenAPI 3.0.3** specification
- **JWT Authentication**
- **Role-Based Access Control (RBAC)**
- **Comprehensive endpoint coverage**

## 🔗 API Endpoints Overview

### Authentication
- `POST /auth/login` - Đăng nhập

### Hồ sơ (Records)
- `GET /records` - Danh sách hồ sơ
- `POST /records` - Tạo hồ sơ mới
- `GET /records/{id}` - Chi tiết hồ sơ
- `PUT /records/{id}` - Cập nhật hồ sơ
- `POST /records/{id}/approve` - Phê duyệt hồ sơ
- `POST /records/{id}/complete` - Hoàn tất hồ sơ
- `POST /records/{id}/decision` - Ban hành quyết định
- `POST /records/{id}/report` - Nộp báo cáo

### Tài liệu (Attachments)
- `GET /records/{id}/attachments` - Danh sách tài liệu
- `POST /records/{id}/attachments` - Upload tài liệu

### Danh mục (Catalogs)
- `GET /catalogs/countries` - Danh sách quốc gia
- `GET /catalogs/purposes` - Danh sách mục đích

### Thống kê (Reports)
- `GET /reports/summary` - Thống kê tổng quan

## 👥 Role-Based Access Control

### Vai trò trong hệ thống:
1. **VIEN_CHUC** - Viên chức (người dùng thông thường)
2. **TRUONG_DON_VI** - Trưởng đơn vị
3. **CHI_BO** - Chi bộ Đảng
4. **DANG_UY** - Đảng ủy
5. **TCHC** - Phòng Tổ chức Hành chính
6. **BGH** - Ban Giám hiệu

### Ma trận phân quyền:

| Endpoint | VIEN_CHUC | TRUONG_DON_VI | CHI_BO | DANG_UY | TCHC | BGH |
|----------|-----------|---------------|--------|---------|------|-----|
| GET /records | Own only | Department | Department | Department | All | All |
| POST /records | Self | Department | Department | Department | All | All |
| PUT /records/{id} | Own (draft) | Department | Department | Department | All | All |
| POST /records/{id}/approve | ❌ | Level 1 | Party (Chi bộ) | Party (Đảng ủy) | Level 4 | Level 5 |
| POST /records/{id}/decision | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| POST /records/{id}/report | Own | Department | Department | Department | All | All |
| GET /reports/summary | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

## 🔐 Authentication & Security

### JWT Token Structure
```json
{
  "sub": "user_id",
  "username": "vc001",
  "roles": ["VIEN_CHUC"],
  "department": "DV001",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Security Headers
- `Authorization: Bearer <token>`
- `Content-Type: application/json`
- `X-API-Key: <api_key>` (for external integrations)

## 📊 Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Thao tác thành công",
  "timestamp": "2025-12-25T10:00:00Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Dữ liệu không hợp lệ",
  "error": "Bad Request",
  "timestamp": "2025-12-25T10:00:00Z"
}
```

## 🚀 Implementation Guide

### 1. Backend (NestJS)
```typescript
// Controller với RBAC
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TCHC', 'BGH')
@Post('/records/:id/decision')
async createDecision(@Param('id') id: string, @Body() dto: CreateDecisionDto) {
  return this.recordsService.createDecision(id, dto);
}
```

### 2. Frontend (React)
```typescript
// Check permissions
const canApprove = usePermissions(['TRUONG_DON_VI', 'TCHC', 'BGH']);
const canCreateDecision = usePermissions(['TCHC', 'BGH']);

if (canApprove) {
  // Show approve button
}
```

### 3. Database (PostgreSQL)
```sql
-- Row Level Security
ALTER TABLE ho_so_di_nuoc_ngoai ENABLE ROW LEVEL SECURITY;

CREATE POLICY records_policy ON ho_so_di_nuoc_ngoai
FOR ALL USING (
  CASE
    WHEN current_setting('app.role') = 'VIEN_CHUC'
    THEN vien_chuc_id = current_setting('app.user_id')::uuid
    WHEN current_setting('app.role') IN ('TRUONG_DON_VI', 'CHI_BO', 'DANG_UY')
    THEN don_vi_id = current_setting('app.department_id')::uuid
    ELSE true -- TCHC, BGH can see all
  END
);
```

## 📁 File Structure

```
backend/
├── openapi-spec.yaml          # OpenAPI 3.0 specification
├── RBAC_Mapping.md           # Role-based access control
├── src/
│   ├── auth/                 # Authentication module
│   ├── records/              # Records management
│   ├── catalogs/             # Catalogs management
│   ├── reports/              # Reports & statistics
│   ├── common/               # Shared utilities
│   │   ├── guards/           # JWT, Roles guards
│   │   ├── decorators/       # @Roles, @Permissions
│   │   └── interceptors/     # Response interceptor
│   └── app.module.ts
└── test/                     # API tests
```

## 🧪 Testing

### Unit Tests
```typescript
describe('RecordsService', () => {
  it('should create record with transaction', async () => {
    const dto = { vien_chuc_id: 'uuid', muc_dich_id: 1 };
    const result = await service.create(dto);
    expect(result).toBeDefined();
  });
});
```

### Integration Tests
```typescript
describe('Records API', () => {
  it('should return 403 for unauthorized approval', async () => {
    const response = await request(app.getHttpServer())
      .post('/records/123/approve')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
```

## 📈 Monitoring & Logging

### Audit Trail
- Tất cả thao tác quan trọng được log
- Theo dõi thay đổi trạng thái hồ sơ
- Ghi nhận người thực hiện và thời gian

### Metrics
- Response time per endpoint
- Error rate by role
- Usage statistics

## 🔄 Future Enhancements

1. **API Versioning**: `/api/v1/`, `/api/v2/`
2. **Rate Limiting**: Per user/role limits
3. **API Gateway**: Centralized routing & auth
4. **GraphQL**: Flexible queries for complex data
5. **WebSocket**: Real-time notifications
6. **Caching**: Redis for performance
7. **Documentation**: Auto-generated from OpenAPI spec

## 📞 Support

- **Technical Docs**: `/api/docs` (Swagger UI)
- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics` (Prometheus)

---

*Generated for Hệ thống Quản lý Hồ sơ Đi Nước Ngoài - Trường Đại học Trà Vinh*