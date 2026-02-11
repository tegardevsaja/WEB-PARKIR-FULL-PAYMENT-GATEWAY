const mysql = require('mysql2');
require('dotenv').config();

async function createDatabase() {
  // Create connection WITHOUT database name
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  try {
    console.log('🔌 Connecting to MySQL...');
    
    // Create database
    await connection.promise().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' created successfully!\n`);
    
    console.log('📝 Now importing schema...');
    
    // Use the database
    await connection.promise().query(`USE ${process.env.DB_NAME}`);
    
    // Read and execute schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.log('⚠️  Schema file not found at:', schemaPath);
      console.log('Please import database_schema.sql manually.\n');
      connection.end();
      return;
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement) {
        await connection.promise().query(statement);
      }
    }
    
    console.log('✅ Schema imported successfully!\n');
    console.log('=================================');
    console.log('✅ Database setup complete!');
    console.log('=================================');
    console.log('Next step: Run seed command');
    console.log('  npm run seed');
    console.log('=================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Manual steps:');
    console.log('1. Open MySQL Command Line or Workbench');
    console.log(`2. Run: CREATE DATABASE ${process.env.DB_NAME};`);
    console.log(`3. Run: USE ${process.env.DB_NAME};`);
    console.log('4. Import database_schema.sql file');
    console.log('5. Then run: npm run seed\n');
  } finally {
    connection.end();
  }
}

createDatabase();
