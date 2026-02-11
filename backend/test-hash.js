const bcrypt = require('bcryptjs');

const password = 'password123';
const hashFromDB = '$2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe';

console.log('Testing password:', password);
console.log('Hash from DB:', hashFromDB);

bcrypt.compare(password, hashFromDB).then(result => {
  console.log('Match result:', result);
  
  if (!result) {
    console.log('\nGenerating new hash for password123...');
    bcrypt.hash(password, 10).then(newHash => {
      console.log('New hash:', newHash);
      console.log('\nUpdate SQL:');
      console.log(`UPDATE users SET password = '${newHash}' WHERE username = 'admin';`);
    });
  }
});
