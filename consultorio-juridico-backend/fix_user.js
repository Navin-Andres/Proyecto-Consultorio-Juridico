const bcrypt = require('bcrypt');

bcrypt.hash('admin12345', 10).then(hash => {
  console.log('\n==================================================');
  console.log('COPIA ESTE HASH PARA TU CONSULTA DE RAILWAY:');
  console.log(hash);
  console.log('==================================================\n');
}).catch(console.error);