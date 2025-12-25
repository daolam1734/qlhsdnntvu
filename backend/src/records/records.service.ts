import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/base.service';
import { TransactionalMethod } from '../common/transaction.decorator';
import { HoSoDiNuocNgoai } from '../entities/ho-so-di-nuoc-ngoai.entity';
import { CreateHoSoDto } from '../dto/create-ho-so.dto';
import { UpdateHoSoDto } from '../dto/update-ho-so.dto';

@Injectable()
export class RecordsService extends BaseService {
  constructor(
    @InjectRepository(HoSoDiNuocNgoai)
    private readonly hoSoRepository: Repository<HoSoDiNuocNgoai>,
  ) {
    super(null); // Pass DataSource if needed
  }

  /**
   * Tạo hồ sơ mới với transaction
   */
  @TransactionalMethod()
  async create(createHoSoDto: CreateHoSoDto): Promise<HoSoDiNuocNgoai> {
    return this.executeInTransaction(async () => {
      // Validate input
      this.validateRequired(createHoSoDto.vien_chuc_id, 'viên chức');
      this.validateRequired(createHoSoDto.muc_dich_id, 'mục đích');
      this.validateDateRange(createHoSoDto.tu_ngay, createHoSoDto.den_ngay);

      const hoSo = this.hoSoRepository.create(createHoSoDto);
      return await this.hoSoRepository.save(hoSo);
    });
  }

  /**
   * Cập nhật hồ sơ với transaction
   */
  @TransactionalMethod()
  async update(id: string, updateHoSoDto: UpdateHoSoDto): Promise<HoSoDiNuocNgoai> {
    return this.executeInTransaction(async () => {
      const hoSo = await this.hoSoRepository.findOne({ where: { ho_so_id: id } });
      if (!hoSo) {
        throw new Error('Hồ sơ không tồn tại');
      }

      if (updateHoSoDto.tu_ngay && updateHoSoDto.den_ngay) {
        this.validateDateRange(updateHoSoDto.tu_ngay, updateHoSoDto.den_ngay);
      }

      Object.assign(hoSo, updateHoSoDto);
      return await this.hoSoRepository.save(hoSo);
    });
  }

  /**
   * Duyệt hồ sơ với transaction
   */
  @TransactionalMethod()
  async approve(id: string, approverId: string, approvalLevel: number): Promise<void> {
    return this.executeInTransaction(async () => {
      // Insert approval record - trigger will validate order
      await this.hoSoRepository.query(
        `INSERT INTO phe_duyet (phe_duyet_id, ho_so_id, cap_phe_duyet_id, nguoi_duyet_id, ket_qua, thoi_diem_duyet, y_kien)
         VALUES (uuid_generate_v4(), $1, $2, $3, true, CURRENT_TIMESTAMP, 'Đồng ý phê duyệt')`,
        [id, approvalLevel, approverId]
      );
    });
  }

  /**
   * Hoàn tất hồ sơ với transaction
   */
  @TransactionalMethod()
  async complete(id: string): Promise<void> {
    return this.executeInTransaction(async () => {
      await this.hoSoRepository.update(
        { ho_so_id: id },
        { trang_thai_id: 6 } // HOAN_TAT - trigger will check for report
      );
    });
  }

  /**
   * Tạo quyết định với transaction
   */
  @TransactionalMethod()
  async createDecision(id: string, decisionData: any): Promise<void> {
    return this.executeInTransaction(async () => {
      // Insert decision - trigger will validate approvals
      await this.hoSoRepository.query(
        `INSERT INTO quyet_dinh (quyet_dinh_id, ho_so_id, so_quyet_dinh, ngay_ky, nguoi_ky, loai_quyet_dinh_id, so_van_ban_id, trang_thai)
         VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, 'BAN_HANH')`,
        [id, decisionData.so_quyet_dinh, decisionData.ngay_ky, decisionData.nguoi_ky, decisionData.loai_quyet_dinh_id, decisionData.so_van_ban_id]
      );
    });
  }
}