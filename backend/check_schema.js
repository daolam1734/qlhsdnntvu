const pool = require('./src/config/database');

async function checkSchema() {
    const tables = ['dm_muc_dich_chuyen_di', 'dm_loai_chuyen_di', 'dm_quoc_gia', 'dm_trang_thai_ho_so', 'dm_loai_tai_lieu'];

    for(const table of tables) {
        const res = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', [table]);
        console.log(table + ':', res.rows.map(r => r.column_name).join(', '));
    }

    process.exit(0);
}

checkSchema().catch(console.error);