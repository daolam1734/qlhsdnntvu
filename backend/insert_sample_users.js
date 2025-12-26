const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qlhs_dnn_tvu',
  password: '123456',
  port: 5432,
});

// Sample user data
const sampleUsers = [
  {
    mavc: 1,
    ten_dang_nhap: 'admin',
    email: 'admin@tvu.edu.vn',
    mat_khau: 'admin123',
    vai_tro: 'BGH',
    trang_thai: true
  },
  {
    mavc: 2,
    ten_dang_nhap: 'nguyenvana',
    email: 'nguyenvana@tvu.edu.vn',
    mat_khau: 'password123',
    vai_tro: 'VIEN_CHUC',
    trang_thai: true
  },
  {
    mavc: 3,
    ten_dang_nhap: 'tranthib',
    email: 'tranthib@tvu.edu.vn',
    mat_khau: 'password123',
    vai_tro: 'TRUONG_DON_VI',
    trang_thai: true
  },
  {
    mavc: 4,
    ten_dang_nhap: 'levanc',
    email: 'levanc@tvu.edu.vn',
    mat_khau: 'password123',
    vai_tro: 'VIEN_CHUC',
    trang_thai: true
  },
  {
    mavc: 5,
    ten_dang_nhap: 'phamthid',
    email: 'phamthid@tvu.edu.vn',
    mat_khau: 'password123',
    vai_tro: 'TCHC',
    trang_thai: true
  }
];

async function insertSampleUsers() {
  try {
    console.log('Inserting sample users...');

    // Clear existing users
    await pool.query('DELETE FROM nguoi_dung');

    // Insert sample users
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.mat_khau, 12);

      await pool.query(
        `INSERT INTO nguoi_dung (
          mavc, ten_dang_nhap, email, mat_khau_hash, vai_tro, trang_thai, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          user.mavc,
          user.ten_dang_nhap,
          user.email,
          hashedPassword,
          user.vai_tro,
          user.trang_thai
        ]
      );

      console.log(`Inserted user: ${user.ten_dang_nhap}`);
    }

    console.log('Sample users inserted successfully!');
    console.log('\nLogin credentials:');
    sampleUsers.forEach(user => {
      console.log(`${user.ten_dang_nhap}: ${user.mat_khau}`);
    });

  } catch (error) {
    console.error('Error inserting sample users:', error);
  } finally {
    await pool.end();
  }
}

insertSampleUsers();