// add_admin.js
// Script to add admin user to the database programmatically

const pool = require('./src/config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function addAdminUser() {
  const client = await pool.connect();

  try {
    console.log('🚀 Adding admin user to database...\n');

    // Admin user data
    const adminData = {
      mavc: 9999, // Use a high number to avoid conflicts
      username: 'superadmin',
      email: 'superadmin@university.edu.vn',
      password: 'Admin123!',
      fullName: 'Super Administrator',
      departmentCode: 'ADMIN',
      departmentName: 'Ban Quản trị',
      birthDate: '1980-01-01',
      gender: 'Nam',
      phone: '0123456780',
      address: 'Trường Đại học Trà Vinh',
      cccd: '012345678901'
    };

    console.log('📝 Admin user details:');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Role: ${adminData.role}`);
    console.log('');

    // Start transaction
    await client.query('BEGIN');

    // 1. Insert or update department
    const deptCode = adminData.departmentCode;
    await client.query(`
      INSERT INTO don_vi (ma_don_vi, ten_don_vi, cap_don_vi, trang_thai, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (ma_don_vi) DO UPDATE SET
        ten_don_vi = EXCLUDED.ten_don_vi,
        updated_at = NOW()
    `, [deptCode, adminData.departmentName, 'Ban', 'ACTIVE']);

    console.log('✅ Department created/updated');

    // 2. Insert or update staff member
    const staffId = adminData.mavc;
    await client.query(`
      INSERT INTO vien_chuc (mavc, ho_ten, ngay_sinh, gioi_tinh, ma_don_vi, la_dang_vien, trang_thai, email, so_dien_thoai, dia_chi, cccd, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      ON CONFLICT (ma_gv) DO UPDATE SET
        ho_ten = EXCLUDED.ho_ten,
        email = EXCLUDED.email,
        so_dien_thoai = EXCLUDED.so_dien_thoai,
        dia_chi = EXCLUDED.dia_chi,
        cccd = EXCLUDED.cccd,
        updated_at = NOW()
    `, [staffId, adminData.fullName, adminData.birthDate, adminData.gender, deptCode, true, 'ACTIVE', adminData.email, adminData.phone, adminData.address, adminData.cccd]);

    console.log('✅ Staff member created/updated');
        so_dien_thoai = EXCLUDED.so_dien_thoai,
        dia_chi = EXCLUDED.dia_chi,
        chuc_vu = EXCLUDED.chuc_vu,
        ngay_cap_nhat = NOW()
    `, [staffId, adminData.fullName, adminData.email, adminData.phone, adminData.address, deptId, adminData.position, 'active']);

    console.log('✅ Staff member created/updated');

    // 3. Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(adminData.password, saltRounds);

    // 4. Insert or update user account
    const userId = adminData.mavc;
    await client.query(`
      INSERT INTO nguoi_dung (mavc, ten_dang_nhap, mat_khau_hash, email, trang_thai, lan_dang_nhap_cuoi, mat_khau_change_at, failed_login_attempts, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, NOW(), NOW())
      ON CONFLICT (mavc) DO UPDATE SET
        ten_dang_nhap = EXCLUDED.ten_dang_nhap,
        mat_khau_hash = EXCLUDED.mat_khau_hash,
        email = EXCLUDED.email,
        trang_thai = EXCLUDED.trang_thai,
        updated_at = NOW()
    `, [userId, adminData.username, passwordHash, adminData.email, true, 0]);

    console.log('✅ Admin user created/updated');

    // 5. Log the admin creation
    await client.query(`
      INSERT INTO lich_su_dang_nhap (mavc, thoi_gian_dang_nhap, dia_chi_ip, thiet_bi, trinh_duyet)
      VALUES ($1, NOW(), $2, $3, $4)
    `, [userId, '127.0.0.1', 'System Setup Script', 'Database Script']);

    console.log('✅ Login history logged');

    // Commit transaction
    await client.query('COMMIT');

    // 6. Display created admin user
    const result = await client.query(`
      SELECT
        nd.ten_dang_nhap as username,
        nd.email,
        vc.ho_ten as full_name,
        dv.ten_don_vi as department,
        nd.trang_thai as status,
        nd.created_at as created_at
      FROM nguoi_dung nd
      LEFT JOIN vien_chuc vc ON nd.ma_gv = vc.ma_gv
      LEFT JOIN don_vi dv ON vc.ma_don_vi = dv.ma_don_vi
      WHERE nd.ma_gv = $1
    `, [userId]);

    console.log('\n🎉 Admin user created successfully!');
    console.log('📋 User details:');
    console.table(result.rows);

    console.log('\n🔐 Login credentials:');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Email: ${adminData.email}`);

    console.log('\n⚠️  Important: Change the password after first login!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding admin user:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Function to add additional admin users
async function addAdditionalAdmins() {
  const client = await pool.connect();

  try {
    console.log('\n➕ Adding additional admin users...\n');

    const additionalAdmins = [
      {
        ma_gv: 9998,
        username: 'admin2',
        email: 'admin2@university.edu.vn',
        password: 'Admin456!',
        fullName: 'Administrator 2',
        birthDate: '1982-03-15',
        gender: 'Nu'
      },
      {
        ma_gv: 9997,
        username: 'sysadmin',
        email: 'sysadmin@university.edu.vn',
        password: 'SysAdmin789!',
        fullName: 'System Administrator',
        birthDate: '1978-07-22',
        gender: 'Nam'
      }
    ];

    for (const admin of additionalAdmins) {
      // Hash password
      const passwordHash = await bcrypt.hash(admin.password, 12);

      // Insert staff member first
      await client.query(`
        INSERT INTO vien_chuc (mavc, ho_ten, ngay_sinh, gioi_tinh, ma_don_vi, la_dang_vien, trang_thai, email, so_dien_thoai, dia_chi, cccd, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        ON CONFLICT (ma_gv) DO UPDATE SET
          ho_ten = EXCLUDED.ho_ten,
          email = EXCLUDED.email,
          updated_at = NOW()
      `, [admin.ma_gv, admin.fullName, admin.birthDate, admin.gender, deptCode, true, 'ACTIVE', admin.email, '0123456789', 'Trường Đại học Trà Vinh', `01234567890${admin.ma_gv}`]);

      // Insert user account
      await client.query(`
        INSERT INTO nguoi_dung (mavc, ten_dang_nhap, mat_khau_hash, email, trang_thai, lan_dang_nhap_cuoi, mat_khau_change_at, failed_login_attempts, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, NOW(), NOW())
        ON CONFLICT (ten_dang_nhap) DO UPDATE SET
          mat_khau_hash = EXCLUDED.mat_khau_hash,
          email = EXCLUDED.email,
          updated_at = NOW()
      `, [admin.mavc, admin.username, passwordHash, admin.email, true, 0]);

      console.log(`✅ Additional admin created: ${admin.username}`);
    }

    console.log('\n📋 All admin users:');
    const result = await client.query(`
      SELECT
        nd.ten_dang_nhap as username,
        nd.email,
        vc.ho_ten as full_name,
        dv.ten_don_vi as department,
        nd.created_at as created_at
      FROM nguoi_dung nd
      LEFT JOIN vien_chuc vc ON nd.ma_gv = vc.ma_gv
      LEFT JOIN don_vi dv ON vc.ma_don_vi = dv.ma_don_vi
      WHERE dv.ma_don_vi = $1 OR nd.ten_dang_nhap LIKE 'admin%' OR nd.ten_dang_nhap LIKE 'sysadmin%'
      ORDER BY nd.created_at
    `, [deptCode]);

    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error adding additional admins:', error);
  } finally {
    client.release();
  }
}

// Main execution
async function main() {
  try {
    await addAdminUser();
    await addAdditionalAdmins();
    console.log('\n🎊 All admin users added successfully!');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { addAdminUser, addAdditionalAdmins };