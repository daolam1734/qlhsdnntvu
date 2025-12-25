import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { HoSoDiNuocNgoai } from '../records/record.entity';

@Entity('nguoi_dung')
export class User {
  @PrimaryGeneratedColumn('uuid')
  nguoi_dung_id: string;

  @Column()
  ten_dang_nhap: string;

  @Column()
  mat_khau_hash: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  trang_thai: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lan_dang_nhap_cuoi: Date;

  @OneToMany(() => HoSoDiNuocNgoai, hoSo => hoSo.vien_chuc)
  records: HoSoDiNuocNgoai[];
}