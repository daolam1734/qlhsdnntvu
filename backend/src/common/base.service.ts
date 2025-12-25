import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export abstract class BaseService {
  constructor(protected readonly dataSource: DataSource) {}

  /**
   * Execute operation within transaction
   */
  protected async executeInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Handle database errors and map to application exceptions
   */
  protected handleDatabaseError(error: any): never {
    console.error('Database Error:', error);

    // PostgreSQL error codes
    switch (error.code) {
      case '23505': // unique_violation
        throw new ConflictException('Dữ liệu đã tồn tại trong hệ thống');

      case '23503': // foreign_key_violation
        throw new BadRequestException('Dữ liệu tham chiếu không hợp lệ');

      case '23502': // not_null_violation
        throw new BadRequestException('Thiếu thông tin bắt buộc');

      case 'P0001': // raise_exception from triggers
        this.handleTriggerException(error);
        break;

      default:
        throw new BadRequestException('Lỗi xử lý dữ liệu: ' + error.message);
    }
  }

  /**
   * Handle exceptions raised by database triggers
   */
  private handleTriggerException(error: any): never {
    const message = error.detail || error.message || '';

    // Map trigger exception messages to user-friendly errors
    if (message.includes('Hồ sơ chưa đủ phê duyệt hành chính')) {
      throw new BadRequestException('Hồ sơ chưa được phê duyệt đầy đủ bởi các cấp hành chính');
    }

    if (message.includes('Hồ sơ Đảng viên chưa được phê duyệt Đảng')) {
      throw new BadRequestException('Hồ sơ của Đảng viên phải được phê duyệt bởi tổ chức Đảng');
    }

    if (message.includes('Không thể hoàn tất hồ sơ khi chưa có báo cáo')) {
      throw new BadRequestException('Không thể hoàn tất hồ sơ khi chưa có báo cáo sau chuyến đi');
    }

    if (message.includes('Chưa duyệt đủ các cấp trước đó')) {
      throw new BadRequestException('Phải duyệt theo đúng thứ tự cấp phê duyệt');
    }

    if (message.includes('Không được chỉnh sửa quyết định đã ban hành')) {
      throw new ConflictException('Quyết định đã ban hành không được phép chỉnh sửa');
    }

    // Default trigger error
    throw new BadRequestException('Lỗi quy tắc nghiệp vụ: ' + message);
  }

  /**
   * Validate required fields
   */
  protected validateRequired(value: any, fieldName: string): void {
    if (value === null || value === undefined || value === '') {
      throw new BadRequestException(`Trường ${fieldName} là bắt buộc`);
    }
  }

  /**
   * Validate date range
   */
  protected validateDateRange(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) {
      throw new BadRequestException('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }
  }
}