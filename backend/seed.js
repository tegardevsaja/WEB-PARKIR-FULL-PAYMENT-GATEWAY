const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Disable foreign key checks temporarily
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    // 1. Seed Vehicle Types
    console.log('📦 Seeding vehicle types...');
    await db.query('DELETE FROM vehicle_types');
    await db.query(`
      INSERT INTO vehicle_types (type_name) VALUES
      ('Motor'),
      ('Mobil'),
      ('Bus/Truk')
    `);
    console.log('✅ Vehicle types seeded\n');

    // 2. Seed Branches
    console.log('🏢 Seeding branches...');
    await db.query('DELETE FROM branches');
    await db.query(`
      INSERT INTO branches (branch_name, address, phone) VALUES
      ('Cabang Pusat', 'Jl. Sudirman No. 123, Jakarta Pusat', '021-1234567'),
      ('Cabang Utara', 'Jl. Ahmad Yani No. 456, Jakarta Utara', '021-7654321'),
      ('Cabang Selatan', 'Jl. Fatmawati No. 789, Jakarta Selatan', '021-9876543')
    `);
    console.log('✅ Branches seeded\n');

    // 3. Seed Users
    console.log('👥 Seeding users...');
    await db.query('DELETE FROM users');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const petugasPassword = await bcrypt.hash('petugas123', 10);
    const ownerPassword = await bcrypt.hash('owner123', 10);

    console.log('   Hashing passwords...');
    console.log('   Admin password hash:', adminPassword.substring(0, 20) + '...');

    const [result] = await db.query(`
      INSERT INTO users (username, password, full_name, role, branch_id) VALUES
      (?, ?, 'Super Administrator', 'admin', NULL),
      (?, ?, 'Owner Cabang Pusat', 'owner', 1),
      (?, ?, 'Owner Cabang Utara', 'owner', 2),
      (?, ?, 'Owner Cabang Selatan', 'owner', 3),
      (?, ?, 'Petugas Shift Pagi - Pusat', 'petugas', 1),
      (?, ?, 'Petugas Shift Siang - Pusat', 'petugas', 1),
      (?, ?, 'Petugas Shift Pagi - Utara', 'petugas', 2),
      (?, ?, 'Petugas Shift Siang - Utara', 'petugas', 2),
      (?, ?, 'Petugas Shift Pagi - Selatan', 'petugas', 3)
    `, [
      'admin', adminPassword,
      'owner1', ownerPassword,
      'owner2', ownerPassword,
      'owner3', ownerPassword,
      'petugas1', petugasPassword,
      'petugas2', petugasPassword,
      'petugas3', petugasPassword,
      'petugas4', petugasPassword,
      'petugas5', petugasPassword
    ]);

    console.log(`✅ Users seeded (${result.affectedRows} users created)`);
    console.log('   - Admin: admin / admin123');
    console.log('   - Owner: owner1 / owner123');
    console.log('   - Petugas: petugas1 / petugas123\n');

    // 4. Seed Parking Areas
    console.log('🅿️  Seeding parking areas...');
    await db.query('DELETE FROM parking_areas');
    await db.query(`
      INSERT INTO parking_areas (branch_id, area_name, capacity) VALUES
      (1, 'Area A - Motor', 100),
      (1, 'Area B - Mobil', 50),
      (1, 'Area C - Bus/Truk', 20),
      (2, 'Area A - Motor', 80),
      (2, 'Area B - Mobil', 40),
      (3, 'Area A - Motor', 120),
      (3, 'Area B - Mobil', 60)
    `);
    console.log('✅ Parking areas seeded\n');

    // 5. Seed Parking Rates
    console.log('💰 Seeding parking rates...');
    await db.query('DELETE FROM parking_rates');
    await db.query(`
      INSERT INTO parking_rates (branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date) VALUES
      (1, 1, 2000, 1000, '2024-01-01'),
      (1, 2, 5000, 3000, '2024-01-01'),
      (1, 3, 10000, 5000, '2024-01-01'),
      (2, 1, 2000, 1000, '2024-01-01'),
      (2, 2, 5000, 3000, '2024-01-01'),
      (2, 3, 10000, 5000, '2024-01-01'),
      (3, 1, 2500, 1500, '2024-01-01'),
      (3, 2, 6000, 3500, '2024-01-01'),
      (3, 3, 12000, 6000, '2024-01-01')
    `);
    console.log('✅ Parking rates seeded\n');

    // Re-enable foreign key checks
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('=================================');
    console.log('Default Login Credentials:');
    console.log('=================================');
    console.log('Admin:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('');
    console.log('Owner (Cabang Pusat):');
    console.log('  Username: owner1');
    console.log('  Password: owner123');
    console.log('');
    console.log('Petugas (Cabang Pusat):');
    console.log('  Username: petugas1');
    console.log('  Password: petugas123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    // Re-enable foreign key checks even on error
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    process.exit(1);
  }
}

seedDatabase();
