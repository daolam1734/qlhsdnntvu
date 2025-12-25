import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaiLieuDinhKem } from './file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(TaiLieuDinhKem)
    private filesRepository: Repository<TaiLieuDinhKem>,
  ) {}

  findAll(): Promise<TaiLieuDinhKem[]> {
    return this.filesRepository.find({ relations: ['ho_so'] });
  }

  async findOne(id: number): Promise<TaiLieuDinhKem> {
    const file = await this.filesRepository.findOne({
      where: { tai_lieu_id: id.toString() },
      relations: ['ho_so'],
    });
    if (!file) throw new Error('File not found');
    return file;
  }

  async create(file: Partial<TaiLieuDinhKem>): Promise<TaiLieuDinhKem> {
    const newFile = this.filesRepository.create(file);
    return this.filesRepository.save(newFile);
  }

  async update(id: number, file: Partial<TaiLieuDinhKem>): Promise<TaiLieuDinhKem> {
    await this.filesRepository.update(id, file);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.filesRepository.delete(id);
  }
}