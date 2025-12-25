import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HoSoDiNuocNgoai } from './record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(HoSoDiNuocNgoai)
    private recordsRepository: Repository<HoSoDiNuocNgoai>,
  ) {}

  findAll(): Promise<HoSoDiNuocNgoai[]> {
    return this.recordsRepository.find({ relations: ['vien_chuc', 'tai_lieu_dinh_kem'] });
  }

  async findOne(id: number): Promise<HoSoDiNuocNgoai> {
    const record = await this.recordsRepository.findOne({
      where: { ho_so_id: id.toString() },
      relations: ['vien_chuc', 'tai_lieu_dinh_kem'],
    });
    if (!record) throw new Error('Record not found');
    return record;
  }

  async create(record: Partial<HoSoDiNuocNgoai>): Promise<HoSoDiNuocNgoai> {
    const newRecord = this.recordsRepository.create(record);
    return this.recordsRepository.save(newRecord);
  }

  async update(id: number, record: Partial<HoSoDiNuocNgoai>): Promise<HoSoDiNuocNgoai> {
    await this.recordsRepository.update(id, record);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.recordsRepository.delete(id);
  }
}