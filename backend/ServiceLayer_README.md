# Service Layer Skeleton - QLHS_DNN_TVU

## Tổng quan

Service Layer được thiết kế để xử lý business logic, quản lý transaction và mapping exception từ database triggers.

## Cấu trúc

### 1. BaseService (`common/base.service.ts`)
- Lớp cơ sở cho tất cả services
- Quản lý transaction với `executeInTransaction()`
- Mapping exception từ database triggers
- Validation methods chung

### 2. RecordsService (`records/records.service.ts`)
- Service xử lý hồ sơ đi nước ngoài
- Sử dụng `@TransactionalMethod()` decorator
- Tích hợp validation và error handling

### 3. DatabaseExceptionFilter (`common/database-exception.filter.ts`)
- Global exception filter cho toàn bộ ứng dụng
- Mapping PostgreSQL errors sang HTTP responses
- Xử lý trigger exceptions

### 4. Transaction Decorator (`common/transaction.decorator.ts`)
- Decorator `@TransactionalMethod()` cho methods
- Hỗ trợ transaction management

## Transaction Management

```typescript
// Sử dụng decorator
@TransactionalMethod()
async createRecord(data: CreateDto): Promise<Entity> {
  return this.executeInTransaction(async () => {
    // Business logic here
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  });
}
```

## Exception Mapping

### Database Errors → HTTP Exceptions

| PostgreSQL Code | HTTP Status | Message |
|----------------|-------------|---------|
| 23505 (Unique) | 409 Conflict | Dữ liệu đã tồn tại |
| 23503 (FK) | 400 Bad Request | Dữ liệu tham chiếu không hợp lệ |
| 23502 (Not Null) | 400 Bad Request | Thiếu thông tin bắt buộc |
| P0001 (Trigger) | 400 Bad Request | Business rule violation |

### Trigger Exceptions

- **Hồ sơ chưa đủ phê duyệt hành chính** → "Hồ sơ chưa được phê duyệt đầy đủ bởi các cấp hành chính"
- **Hồ sơ Đảng viên chưa được phê duyệt Đảng** → "Hồ sơ của Đảng viên phải được phê duyệt bởi tổ chức Đảng"
- **Không thể hoàn tất hồ sơ khi chưa có báo cáo** → "Không thể hoàn tất hồ sơ khi chưa có báo cáo sau chuyến đi"
- **Chưa duyệt đủ các cấp trước đó** → "Phải duyệt theo đúng thứ tự cấp phê duyệt"
- **Không được chỉnh sửa quyết định đã ban hành** → "Quyết định đã ban hành không được phép chỉnh sửa"

## Validation Methods

```typescript
// Validate required fields
this.validateRequired(value, 'field_name');

// Validate date range
this.validateDateRange(startDate, endDate);
```

## Sử dụng trong Controller

```typescript
@Post()
async create(@Body() dto: CreateDto) {
  try {
    return await this.recordsService.create(dto);
  } catch (error) {
    // Exception sẽ được filter xử lý tự động
    throw error;
  }
}
```

## Cài đặt Dependencies

```bash
npm install nestjs-cls typeorm @nestjs/common
```

## Kết luận

Service Layer skeleton này cung cấp:

- ✅ **Transaction safety**: Tất cả operations trong transaction
- ✅ **Error handling**: Mapping database errors sang user-friendly messages
- ✅ **Business rules**: Enforce qua database triggers
- ✅ **Validation**: Input validation trước khi xử lý
- ✅ **Extensibility**: Dễ dàng extend cho các services khác