import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { HoSoDiNuocNgoai } from '../records/record.entity';

@Entity('tai_lieu_dinh_kem')
export class TaiLieuDinhKem {
  @PrimaryGeneratedColumn('uuid')
  tai_lieu_id: string;

  @ManyToOne(() => HoSoDiNuocNgoai, hoSo => hoSo.tai_lieu_dinh_kem, { onDelete: 'CASCADE' })
  ho_so: HoSoDiNuocNgoai;

  @Column()
  ho_so_id: string;

  @Column({ nullable: true })
  loai_tai_lieu_id: number;

  @Column()
  ten_file: string;

  @Column()
  duong_dan_file: string;

  @Column({ type: 'bigint', nullable: true })
  kich_thuoc: number;

  @CreateDateColumn()
  ngay_tai_len: Date;
}