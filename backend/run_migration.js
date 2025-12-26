const pool = require('./src/config/database');
const fs = require('fs');

async function runMigration() {
    try {
        console.log('Starting major schema migration: Changing category tables to use ma fields as primary keys...');

        // Read and execute the migration SQL
        const migrationSQL = fs.readFileSync('../database/migrations/change_pk_to_ma.sql', 'utf8');
        console.log('Running schema migration...');
        await pool.query(migrationSQL);

        // Clear existing data
        console.log('Clearing old sample data...');
        const tables = ['dm_muc_dich_chuyen_di', 'dm_loai_chuyen_di', 'dm_quoc_gia', 'dm_trang_thai_ho_so', 'dm_loai_tai_lieu'];
        for (const table of tables) {
            await pool.query(`DELETE FROM ${table}`);
        }

        // Insert new sample data
        console.log('Inserting new sample data...');
        const sampleSQL = fs.readFileSync('../database/sample_categories_new_schema.sql', 'utf8');
        await pool.query(sampleSQL);

        console.log('Migration completed successfully!');
        console.log('Category tables now use ma fields as primary keys.');
        console.log('Foreign key relationships have been updated accordingly.');

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

runMigration().catch(console.error);