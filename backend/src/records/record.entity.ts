import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { TaiLieuDinhKem } from '../files/file.entity';

@Entity('ho_so_di_nuoc_ngoai')
export class HoSoDiNuocNgoai {
  @PrimaryGeneratedColumn('uuid')
  ho_so_id: string;

  @Column({ nullable: true })
  ma_ho_so: string;

  @ManyToOne(() => User, user => user.records, { onDelete: 'CASCADE' })
  vien_chuc: User;

  @Column()
  vien_chuc_id: string;

  @Column({ nullable: true })
  muc_dich_id: number;

  @Column({ nullable: true })
  loai_chuyen_di_id: number;

  @Column({ nullable: true })
  quoc_gia_id: number;

  @Column({ type: 'date', nullable: true })
  tu_ngay: Date;

  @Column({ type: 'date', nullable: true })
  den_ngay: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  kinh_phi_du_kien: number;

  @Column({ nullable: true })
  trang_thai_id: number;

  @CreateDateColumn()
  ngay_tao: Date;

  @Column({ type: 'text', nullable: true })
  ghi_chu: string;

  @OneToMany(() => TaiLieuDinhKem, taiLieu => taiLieu.ho_so)
  tai_lieu_dinh_kem: TaiLieuDinhKem[];
}