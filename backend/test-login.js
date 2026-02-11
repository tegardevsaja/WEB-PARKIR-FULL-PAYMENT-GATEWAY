const axios = require('axios');
require('dotenv').config();

const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;

console.log('=================================');
console.log('🧪 Testing Login Endpoint');
console.log('=================================\n');

async function testLogin() {
  try {
    console.log('📡 Testing endpoint:', `${API_URL}/auth/login`);
    console.log('📝 Credentials: admin / password123\n');

    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'password123'
    });

    console.log('✅ Login successful!\n');
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n=================================');
    console.log('✅ Backend is working correctly!');
    console.log('=================================\n');

  } catch (error) {
    console.log('❌ Login failed!\n');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      
      if (error.response.status === 500) {
        console.log('\n💡 Possible causes:');
        console.log('   1. Database not connected');
        console.log('   2. Database not seeded');
        console.log('   3. Wrong password hash');
        console.log('\n🔧 Try:');
        console.log('   npm run test-db');
        console.log('   npm run seed');
      }
    } else if (error.request) {
      console.log('❌ No response from server');
      console.log('\n💡 Possible causes:');
      console.log('   1. Backend not running');
      console.log('   2. Wrong port');
      console.log('\n🔧 Try:');
      console.log('   npm run dev');
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('\n=================================\n');
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    console.log('🔍 Checking if server is running...');
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Server is running\n');
    return true;
  } catch (error) {
    console.log('❌ Server is not running\n');
    console.log('💡 Start the server first:');
    console.log('   npm run dev\n');
    return false;
  }
}

async function run() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testLogin();
  }
}

run();
