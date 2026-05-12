const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'consultorio-juridico',
  password: '12345',
  port: 5432
});

client.connect().then(async () => {
  const hash = await bcrypt.hash('admin12345', 10);
  await client.query('UPDATE usuarios SET password = $1 WHERE email = $2', [hash, 'admin@areandina.edu.co']);
  console.log('Contraseña arreglada! Ahora el hash sirve para admin12345');
  client.end();
}).catch(console.error);