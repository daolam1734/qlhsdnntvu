const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qlhs_dnn_tvu',
  password: '123456',
  port: 5432,
});

async function updatePassword() {
  try {
    const newPassword = 'admin123';
    const hash = await bcrypt.hash(newPassword, 12);

    const query = 'UPDATE nguoi_dung SET mat_khau_hash = $1 WHERE ten_dang_nhap = $2';
    await pool.query(query, [hash, 'admin']);

    console.log('Password updated successfully for admin');
    console.log('New password: admin123');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await pool.end();
  }
}

updatePassword();