const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qlhs_dnn_tvu',
  password: '123456',
  port: 5432,
});

// Complete sample data with proper UTF-8 encoding
const sampleData = {
  dm_muc_dich_chuyen_di: [
    { id: 1, ten: 'Học tập', mo_ta: 'Chuyến đi học tập, nghiên cứu', thu_tu: 1, trang_thai: true },
    { id: 2, ten: 'Công tác', mo_ta: 'Chuyến đi công tác, họp hành', thu_tu: 2, trang_thai: true },
    { id: 3, ten: 'Hội thảo', mo_ta: 'Tham gia hội thảo, hội nghị', thu_tu: 3, trang_thai: true },
    { id: 4, ten: 'Trao đổi', mo_ta: 'Trao đổi kinh nghiệm, hợp tác', thu_tu: 4, trang_thai: true },
    { id: 5, ten: 'Khác', mo_ta: 'Mục đích khác', thu_tu: 5, trang_thai: true }
  ],
  dm_trang_thai_ho_so: [
    { id: 1, ten: 'Chờ duyệt', mo_ta: 'Hồ sơ đang chờ phê duyệt', thu_tu: 1, trang_thai: true },
    { id: 2, ten: 'Đã duyệt', mo_ta: 'Hồ sơ đã được phê duyệt', thu_tu: 2, trang_thai: true },
    { id: 3, ten: 'Từ chối', mo_ta: 'Hồ sơ bị từ chối', thu_tu: 3, trang_thai: true },
    { id: 4, ten: 'Đang xử lý', mo_ta: 'Hồ sơ đang được xử lý', thu_tu: 4, trang_thai: true },
    { id: 5, ten: 'Hoàn thành', mo_ta: 'Hồ sơ đã hoàn thành', thu_tu: 5, trang_thai: true },
    { id: 6, ten: 'Tạm dừng', mo_ta: 'Hồ sơ tạm dừng xử lý', thu_tu: 6, trang_thai: true },
    { id: 7, ten: 'Hủy bỏ', mo_ta: 'Hồ sơ đã hủy bỏ', thu_tu: 7, trang_thai: true },
    { id: 8, ten: 'Chờ bổ sung', mo_ta: 'Hồ sơ chờ bổ sung thông tin', thu_tu: 8, trang_thai: true }
  ],
  dm_loai_tai_lieu: [
    { id: 1, ten: 'Hộ chiếu', mo_ta: 'Hộ chiếu còn hạn', thu_tu: 1, trang_thai: true },
    { id: 2, ten: 'Visa', mo_ta: 'Thị thực nhập cảnh', thu_tu: 2, trang_thai: true },
    { id: 3, ten: 'Giấy mời', mo_ta: 'Thư mời từ nước ngoài', thu_tu: 3, trang_thai: true },
    { id: 4, ten: 'Vé máy bay', mo_ta: 'Vé máy bay khứ hồi', thu_tu: 4, trang_thai: true },
    { id: 5, ten: 'Giấy tờ khác', mo_ta: 'Các giấy tờ khác', thu_tu: 5, trang_thai: true },
    { id: 6, ten: 'Bảo hiểm', mo_ta: 'Giấy chứng nhận bảo hiểm', thu_tu: 6, trang_thai: true }
  ]
};

async function fixAllData() {
  try {
    // Clear existing data
    await pool.query('DELETE FROM dm_muc_dich_chuyen_di');
    await pool.query('DELETE FROM dm_trang_thai_ho_so');
    await pool.query('DELETE FROM dm_loai_tai_lieu');

    // Insert dm_muc_dich_chuyen_di
    for (const item of sampleData.dm_muc_dich_chuyen_di) {
      await pool.query(
        'INSERT INTO dm_muc_dich_chuyen_di (id, ten, mo_ta, thu_tu, trang_thai) VALUES ($1, $2, $3, $4, $5)',
        [item.id, item.ten, item.mo_ta, item.thu_tu, item.trang_thai]
      );
    }

    // Insert dm_trang_thai_ho_so
    for (const item of sampleData.dm_trang_thai_ho_so) {
      await pool.query(
        'INSERT INTO dm_trang_thai_ho_so (id, ten, mo_ta, thu_tu, trang_thai) VALUES ($1, $2, $3, $4, $5)',
        [item.id, item.ten, item.mo_ta, item.thu_tu, item.trang_thai]
      );
    }

    // Insert dm_loai_tai_lieu
    for (const item of sampleData.dm_loai_tai_lieu) {
      await pool.query(
        'INSERT INTO dm_loai_tai_lieu (id, ten, mo_ta, thu_tu, trang_thai) VALUES ($1, $2, $3, $4, $5)',
        [item.id, item.ten, item.mo_ta, item.thu_tu, item.trang_thai]
      );
    }

    console.log('All data inserted successfully');

    // Verify the data
    const mucDich = await pool.query('SELECT * FROM dm_muc_dich_chuyen_di ORDER BY id');
    console.log('dm_muc_dich_chuyen_di:', JSON.stringify(mucDich.rows, null, 2));

    const trangThai = await pool.query('SELECT * FROM dm_trang_thai_ho_so ORDER BY id');
    console.log('dm_trang_thai_ho_so:', JSON.stringify(trangThai.rows, null, 2));

    const loaiTaiLieu = await pool.query('SELECT * FROM dm_loai_tai_lieu ORDER BY id');
    console.log('dm_loai_tai_lieu:', JSON.stringify(loaiTaiLieu.rows, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

fixAllData();