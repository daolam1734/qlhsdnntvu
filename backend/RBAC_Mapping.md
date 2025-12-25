# Role-Based Access Control (RBAC) Mapping
# Ánh xạ vai trò ↔ endpoint trong hệ thống QLHS_DNN_TVU

## Vai trò trong hệ thống:
# - VIEN_CHUC: Viên chức (người dùng thông thường)
# - TRUONG_DON_VI: Trưởng đơn vị
# - CHI_BO: Chi bộ Đảng
# - DANG_UY: Đảng ủy
# - TCHC: Phòng Tổ chức Hành chính
# - BGH: Ban Giám hiệu

## Quy tắc phân quyền:
# 1. VIEN_CHUC: Chỉ được tạo và xem hồ sơ của chính mình
# 2. TRUONG_DON_VI: Phê duyệt cấp 1, xem hồ sơ đơn vị
# 3. CHI_BO: Phê duyệt Đảng cấp chi bộ
# 4. DANG_UY: Phê duyệt Đảng cấp đảng ủy
# 5. TCHC: Phê duyệt cấp 4, quản lý toàn hệ thống
# 6. BGH: Phê duyệt cấp 5, ban hành quyết định

---

## 1. AUTHENTICATION ENDPOINTS
# Đăng nhập - tất cả vai trò đều có thể truy cập
POST /auth/login
  - ALL: *

---

## 2. RECORDS ENDPOINTS (Hồ sơ)

### GET /records - Lấy danh sách hồ sơ
- VIEN_CHUC: Chỉ xem hồ sơ của chính mình
- TRUONG_DON_VI: Xem hồ sơ của đơn vị
- CHI_BO: Xem hồ sơ của đơn vị
- DANG_UY: Xem hồ sơ của đơn vị
- TCHC: Xem tất cả hồ sơ
- BGH: Xem tất cả hồ sơ

### POST /records - Tạo hồ sơ mới
- VIEN_CHUC: Tạo hồ sơ cho chính mình
- TRUONG_DON_VI: Tạo hồ sơ cho viên chức trong đơn vị
- CHI_BO: Tạo hồ sơ cho viên chức trong đơn vị
- DANG_UY: Tạo hồ sơ cho viên chức trong đơn vị
- TCHC: Tạo hồ sơ cho bất kỳ viên chức nào
- BGH: Tạo hồ sơ cho bất kỳ viên chức nào

### GET /records/{id} - Xem chi tiết hồ sơ
- VIEN_CHUC: Chỉ xem hồ sơ của chính mình
- TRUONG_DON_VI: Xem hồ sơ của đơn vị
- CHI_BO: Xem hồ sơ của đơn vị
- DANG_UY: Xem hồ sơ của đơn vị
- TCHC: Xem tất cả hồ sơ
- BGH: Xem tất cả hồ sơ

### PUT /records/{id} - Cập nhật hồ sơ
- VIEN_CHUC: Chỉ cập nhật hồ sơ của chính mình (trước khi submit)
- TRUONG_DON_VI: Cập nhật hồ sơ của đơn vị (trước phê duyệt)
- CHI_BO: Cập nhật hồ sơ của đơn vị (trước phê duyệt)
- DANG_UY: Cập nhật hồ sơ của đơn vị (trước phê duyệt)
- TCHC: Cập nhật bất kỳ hồ sơ nào
- BGH: Cập nhật bất kỳ hồ sơ nào

### POST /records/{id}/approve - Phê duyệt hồ sơ
- TRUONG_DON_VI: Phê duyệt cấp 1 (Trưởng đơn vị)
- CHI_BO: Phê duyệt Đảng cấp chi bộ
- DANG_UY: Phê duyệt Đảng cấp đảng ủy
- TCHC: Phê duyệt cấp 4 (TCHC)
- BGH: Phê duyệt cấp 5 (BGH)
- VIEN_CHUC: Không có quyền

### POST /records/{id}/complete - Hoàn tất hồ sơ
- TCHC: Hoàn tất hồ sơ đã có quyết định
- BGH: Hoàn tất hồ sơ đã có quyết định
- VIEN_CHUC: Không có quyền
- TRUONG_DON_VI: Không có quyền
- CHI_BO: Không có quyền
- DANG_UY: Không có quyền

### POST /records/{id}/decision - Ban hành quyết định
- TCHC: Tạo quyết định cho hồ sơ đủ điều kiện
- BGH: Tạo quyết định cho hồ sơ đủ điều kiện
- VIEN_CHUC: Không có quyền
- TRUONG_DON_VI: Không có quyền
- CHI_BO: Không có quyền
- DANG_UY: Không có quyền

### POST /records/{id}/report - Nộp báo cáo
- VIEN_CHUC: Nộp báo cáo cho hồ sơ của chính mình
- TRUONG_DON_VI: Nộp báo cáo cho hồ sơ của đơn vị
- CHI_BO: Nộp báo cáo cho hồ sơ của đơn vị
- DANG_UY: Nộp báo cáo cho hồ sơ của đơn vị
- TCHC: Nộp báo cáo cho bất kỳ hồ sơ nào
- BGH: Nộp báo cáo cho bất kỳ hồ sơ nào

---

## 3. ATTACHMENTS ENDPOINTS (Tài liệu đính kèm)

### GET /records/{id}/attachments - Xem tài liệu
- VIEN_CHUC: Xem tài liệu hồ sơ của chính mình
- TRUONG_DON_VI: Xem tài liệu hồ sơ của đơn vị
- CHI_BO: Xem tài liệu hồ sơ của đơn vị
- DANG_UY: Xem tài liệu hồ sơ của đơn vị
- TCHC: Xem tài liệu tất cả hồ sơ
- BGH: Xem tài liệu tất cả hồ sơ

### POST /records/{id}/attachments - Upload tài liệu
- VIEN_CHUC: Upload tài liệu cho hồ sơ của chính mình
- TRUONG_DON_VI: Upload tài liệu cho hồ sơ của đơn vị
- CHI_BO: Upload tài liệu cho hồ sơ của đơn vị
- DANG_UY: Upload tài liệu cho hồ sơ của đơn vị
- TCHC: Upload tài liệu cho bất kỳ hồ sơ nào
- BGH: Upload tài liệu cho bất kỳ hồ sơ nào

---

## 4. CATALOG ENDPOINTS (Danh mục)
# Danh mục công khai - tất cả vai trò đều có thể xem
GET /catalogs/countries
  - ALL: *

GET /catalogs/purposes
  - ALL: *

---

## 5. REPORTS ENDPOINTS (Thống kê)
# Thống kê - chỉ TCHC và BGH được xem
GET /reports/summary
  - TCHC: *
  - BGH: *
  - VIEN_CHUC: Không có quyền
  - TRUONG_DON_VI: Không có quyền
  - CHI_BO: Không có quyền
  - DANG_UY: Không có quyền

---

## 6. IMPLEMENTATION NOTES

### Database-Level Security
- Sử dụng Row Level Security (RLS) trong PostgreSQL
- Policy-based access control theo vai trò
- Trigger validation cho business rules

### Application-Level Security
- JWT token với role claims
- Guard decorators: @Roles(), @Permissions()
- Interceptor để filter data theo quyền

### API Gateway (Future)
- Centralized authorization
- Rate limiting per role
- Audit logging

### Example Implementation

```typescript
// Guard cho role-based access
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TCHC', 'BGH')
@Post('/records/:id/decision')
async createDecision(@Param('id') id: string, @Body() data: CreateDecisionDto) {
  return this.recordsService.createDecision(id, data);
}

// Service với data filtering
async getRecords(user: User) {
  const query = this.repository.createQueryBuilder('record');

  if (user.role === 'VIEN_CHUC') {
    query.where('record.vien_chuc_id = :userId', { userId: user.id });
  } else if (['TRUONG_DON_VI', 'CHI_BO', 'DANG_UY'].includes(user.role)) {
    query.where('record.don_vi_id = :deptId', { deptId: user.departmentId });
  }
  // TCHC, BGH có thể xem tất cả

  return query.getMany();
}
```

### Security Best Practices
1. **Principle of Least Privilege**: Chỉ cấp quyền tối thiểu cần thiết
2. **Defense in Depth**: Bảo mật nhiều lớp (DB + App + API)
3. **Audit Trail**: Ghi log tất cả thao tác quan trọng
4. **Data Encryption**: Mã hóa dữ liệu nhạy cảm
5. **Regular Reviews**: Định kỳ review và cập nhật quyền