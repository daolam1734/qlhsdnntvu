const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qlhs_dnn_tvu',
  password: '123456',
  port: 5432,
});

// Sample data with proper UTF-8 encoding
const sampleData = {
  dm_loai_chuyen_di: [
    { id: 1, ten: 'Cá nhân', mo_ta: 'Chuyến đi cá nhân', thu_tu: 1, trang_thai: true },
    { id: 2, ten: 'Tập thể', mo_ta: 'Chuyến đi tập thể', thu_tu: 2, trang_thai: true },
    { id: 3, ten: 'Theo đoàn', mo_ta: 'Chuyến đi theo đoàn', thu_tu: 3, trang_thai: true }
  ],
  dm_quoc_gia: [
    { id: 1, ten: 'Việt Nam', ma_quoc_gia: 'VN', vung: 'Đông Nam Á', trang_thai: true },
    { id: 2, ten: 'Nhật Bản', ma_quoc_gia: 'JP', vung: 'Châu Á', trang_thai: true },
    { id: 3, ten: 'Hàn Quốc', ma_quoc_gia: 'KR', vung: 'Châu Á', trang_thai: true },
    { id: 4, ten: 'Trung Quốc', ma_quoc_gia: 'CN', vung: 'Châu Á', trang_thai: true },
    { id: 5, ten: 'Singapore', ma_quoc_gia: 'SG', vung: 'Đông Nam Á', trang_thai: true }
  ]
};

async function insertData() {
  try {
    // Clear existing data
    await pool.query('DELETE FROM dm_loai_chuyen_di');
    await pool.query('DELETE FROM dm_quoc_gia');

    // Insert dm_loai_chuyen_di
    for (const item of sampleData.dm_loai_chuyen_di) {
      await pool.query(
        'INSERT INTO dm_loai_chuyen_di (id, ten, mo_ta, thu_tu, trang_thai) VALUES ($1, $2, $3, $4, $5)',
        [item.id, item.ten, item.mo_ta, item.thu_tu, item.trang_thai]
      );
    }

    // Insert dm_quoc_gia
    for (const item of sampleData.dm_quoc_gia) {
      await pool.query(
        'INSERT INTO dm_quoc_gia (id, ten, ma_quoc_gia, vung, trang_thai) VALUES ($1, $2, $3, $4, $5)',
        [item.id, item.ten, item.ma_quoc_gia, item.vung, item.trang_thai]
      );
    }

    console.log('Data inserted successfully');

    // Verify the data
    const loaiChuyenDi = await pool.query('SELECT * FROM dm_loai_chuyen_di');
    console.log('dm_loai_chuyen_di:', JSON.stringify(loaiChuyenDi.rows, null, 2));

    const quocGia = await pool.query('SELECT * FROM dm_quoc_gia');
    console.log('dm_quoc_gia:', JSON.stringify(quocGia.rows, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

insertData();