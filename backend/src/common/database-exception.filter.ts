import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || error;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle TypeORM query errors
      const queryError = exception as QueryFailedError;

      switch (queryError.driverError?.code) {
        case '23505': // unique_violation
          status = HttpStatus.CONFLICT;
          message = 'Dữ liệu đã tồn tại';
          error = 'Conflict';
          break;

        case '23503': // foreign_key_violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Dữ liệu tham chiếu không hợp lệ';
          error = 'Bad Request';
          break;

        case '23502': // not_null_violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Thiếu thông tin bắt buộc';
          error = 'Bad Request';
          break;

        case 'P0001': // raise_exception
          status = HttpStatus.BAD_REQUEST;
          message = this.mapTriggerMessage(queryError.driverError?.detail || queryError.message);
          error = 'Business Rule Violation';
          break;

        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Lỗi cơ sở dữ liệu';
          error = 'Database Error';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Map trigger exception messages to user-friendly messages
   */
  private mapTriggerMessage(detail: string): string {
    if (detail.includes('Hồ sơ chưa đủ phê duyệt hành chính')) {
      return 'Hồ sơ chưa được phê duyệt đầy đủ bởi các cấp hành chính';
    }

    if (detail.includes('Hồ sơ Đảng viên chưa được phê duyệt Đảng')) {
      return 'Hồ sơ của Đảng viên phải được phê duyệt bởi tổ chức Đảng';
    }

    if (detail.includes('Không thể hoàn tất hồ sơ khi chưa có báo cáo')) {
      return 'Không thể hoàn tất hồ sơ khi chưa có báo cáo sau chuyến đi';
    }

    if (detail.includes('Chưa duyệt đủ các cấp trước đó')) {
      return 'Phải duyệt theo đúng thứ tự cấp phê duyệt';
    }

    if (detail.includes('Không được chỉnh sửa quyết định đã ban hành')) {
      return 'Quyết định đã ban hành không được phép chỉnh sửa';
    }

    return detail;
  }
}