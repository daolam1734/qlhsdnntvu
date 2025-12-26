const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

(async () => {
  try {
    const newPassword = process.env.NEW_ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(newPassword, 12);

    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'qlhs_dnn_tvu',
      password: '123456',
      port: 5432,
    });

    await pool.query('UPDATE nguoi_dung SET mat_khau_hash = $1 WHERE mavc = $2', [hash, 1]);
    const res = await pool.query('SELECT mat_khau_hash FROM nguoi_dung WHERE mavc = $1', [1]);
    const stored = res.rows[0].mat_khau_hash;
    console.log('Updated hash:', stored);
    const ok = await bcrypt.compare(newPassword, stored);
    console.log('Password match:', ok);

    await pool.end();
  } catch (err) {
    console.error('Error updating admin password:', err);
    process.exit(1);
  }
})();