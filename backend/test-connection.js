const mysql = require('mysql2');
require('dotenv').config();

console.log('=================================');
console.log('🔍 Testing MySQL Connection');
console.log('=================================\n');

console.log('📋 Configuration:');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(empty)'}`);
console.log(`   Database: ${process.env.DB_NAME}`);
console.log(`   Port: ${process.env.DB_PORT}\n`);

// Test 1: Connection without database
console.log('Test 1: Connecting to MySQL server...');
const connection1 = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

connection1.connect((err) => {
  if (err) {
    console.log('❌ Failed to connect to MySQL server');
    console.log('   Error:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if MySQL is running');
    console.log('   2. Check username and password in .env file');
    console.log('   3. Check MySQL port (default: 3306)');
    console.log('\n   Windows: Check MySQL service in Services');
    console.log('   Command: net start MySQL80\n');
    process.exit(1);
  }
  
  console.log('✅ Connected to MySQL server successfully!\n');
  
  // Test 2: Check if database exists
  console.log('Test 2: Checking if database exists...');
  connection1.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`, (err, results) => {
    if (err) {
      console.log('❌ Error checking database:', err.message);
      connection1.end();
      process.exit(1);
    }
    
    if (results.length === 0) {
      console.log(`❌ Database '${process.env.DB_NAME}' does not exist`);
      console.log('\n💡 Solution:');
      console.log('   Run: npm run setup');
      console.log('   Or manually create database:\n');
      console.log('   1. Open MySQL Command Line or Workbench');
      console.log(`   2. Run: CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`   3. Then run: npm run seed\n`);
      connection1.end();
      process.exit(1);
    }
    
    console.log(`✅ Database '${process.env.DB_NAME}' exists!\n`);
    
    // Test 3: Connect to specific database
    console.log('Test 3: Connecting to database...');
    connection1.end();
    
    const connection2 = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    connection2.connect((err) => {
      if (err) {
        console.log('❌ Failed to connect to database');
        console.log('   Error:', err.message);
        connection2.end();
        process.exit(1);
      }
      
      console.log('✅ Connected to database successfully!\n');
      
      // Test 4: Check tables
      console.log('Test 4: Checking database tables...');
      connection2.query('SHOW TABLES', (err, results) => {
        if (err) {
          console.log('❌ Error checking tables:', err.message);
          connection2.end();
          process.exit(1);
        }
        
        if (results.length === 0) {
          console.log('⚠️  No tables found in database');
          console.log('\n💡 Solution:');
          console.log('   Database exists but empty. Import schema:');
          console.log('   1. Import database_schema.sql file');
          console.log('   2. Then run: npm run seed\n');
          connection2.end();
          process.exit(1);
        }
        
        console.log(`✅ Found ${results.length} tables:\n`);
        results.forEach((row, index) => {
          const tableName = Object.values(row)[0];
          console.log(`   ${index + 1}. ${tableName}`);
        });
        
        // Test 5: Check if tables have data
        console.log('\nTest 5: Checking table data...');
        connection2.query('SELECT COUNT(*) as count FROM users', (err, results) => {
          if (err) {
            console.log('⚠️  Tables exist but might be empty');
            console.log('\n💡 Solution:');
            console.log('   Run: npm run seed\n');
          } else {
            const userCount = results[0].count;
            if (userCount === 0) {
              console.log('⚠️  Tables are empty (no users found)');
              console.log('\n💡 Solution:');
              console.log('   Run: npm run seed\n');
            } else {
              console.log(`✅ Database has data (${userCount} users found)\n`);
            }
          }
          
          console.log('=================================');
          console.log('✅ All tests passed!');
          console.log('=================================');
          console.log('Database is ready to use.');
          console.log('You can now run: npm run dev\n');
          
          connection2.end();
          process.exit(0);
        });
      });
    });
  });
});
