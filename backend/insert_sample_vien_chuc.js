const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qlhs_dnn_tvu',
  password: '123456',
  port: 5432,
});

// Sample vien_chuc data
const sampleVienChuc = [
  {
    mavc: 1,
    ho_ten: 'Administrator',
    ngay_sinh: '1980-01-01',
    gioi_tinh: 'Nam',
    ma_don_vi: 'ADMIN',
    la_dang_vien: true,
    trang_thai: 'ACTIVE',
    email: 'admin@tvu.edu.vn',
    so_dien_thoai: '0123456789',
    dia_chi: 'Địa chỉ admin',
    cccd: '012345678901',
    chuc_vu: 'Quản trị viên'
  },
  {
    mavc: 2,
    ho_ten: 'Nguyễn Văn A',
    ngay_sinh: '1985-05-15',
    gioi_tinh: 'Nam',
    ma_don_vi: 'CNTT',
    la_dang_vien: true,
    trang_thai: 'ACTIVE',
    email: 'nguyenvana@tvu.edu.vn',
    so_dien_thoai: '0123456788',
    dia_chi: 'Địa chỉ A',
    cccd: '012345678902',
    chuc_vu: 'Giảng viên'
  },
  {
    mavc: 3,
    ho_ten: 'Trần Thị B',
    ngay_sinh: '1982-08-20',
    gioi_tinh: 'Nữ',
    ma_don_vi: 'CNTT',
    la_dang_vien: true,
    trang_thai: 'ACTIVE',
    email: 'tranthib@tvu.edu.vn',
    so_dien_thoai: '0123456787',
    dia_chi: 'Địa chỉ B',
    cccd: '012345678903',
    chuc_vu: 'Trưởng khoa'
  },
  {
    mavc: 4,
    ho_ten: 'Lê Văn C',
    ngay_sinh: '1990-03-10',
    gioi_tinh: 'Nam',
    ma_don_vi: 'KT',
    la_dang_vien: false,
    trang_thai: 'ACTIVE',
    email: 'levanc@tvu.edu.vn',
    so_dien_thoai: '0123456786',
    dia_chi: 'Địa chỉ C',
    cccd: '012345678904',
    chuc_vu: 'Giảng viên'
  },
  {
    mavc: 5,
    ho_ten: 'Phạm Thị D',
    ngay_sinh: '1988-12-05',
    gioi_tinh: 'Nữ',
    ma_don_vi: 'TCHC',
    la_dang_vien: true,
    trang_thai: 'ACTIVE',
    email: 'phamthid@tvu.edu.vn',
    so_dien_thoai: '0123456785',
    dia_chi: 'Địa chỉ D',
    cccd: '012345678905',
    chuc_vu: 'Nhân viên'
  }
];

async function insertSampleVienChuc() {
  try {
    console.log('Inserting sample vien_chuc...');

    // Clear existing data
    await pool.query('DELETE FROM nguoi_dung');
    await pool.query('DELETE FROM vien_chuc');

    // Insert sample vien_chuc
    for (const vc of sampleVienChuc) {
      await pool.query(
        `INSERT INTO vien_chuc (
          mavc, ho_ten, ngay_sinh, gioi_tinh, ma_don_vi, la_dang_vien,
          trang_thai, email, so_dien_thoai, dia_chi, cccd, chuc_vu, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
        [
          vc.mavc,
          vc.ho_ten,
          vc.ngay_sinh,
          vc.gioi_tinh,
          vc.ma_don_vi,
          vc.la_dang_vien,
          vc.trang_thai,
          vc.email,
          vc.so_dien_thoai,
          vc.dia_chi,
          vc.cccd,
          vc.chuc_vu
        ]
      );

      console.log(`Inserted vien_chuc: ${vc.ho_ten}`);
    }

    console.log('Sample vien_chuc inserted successfully!');

  } catch (error) {
    console.error('Error inserting sample vien_chuc:', error);
  } finally {
    await pool.end();
  }
}

insertSampleVienChuc();