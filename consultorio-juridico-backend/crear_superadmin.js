/**
 * Script para crear un superadmin desde la terminal.
 * Uso: node crear_superadmin.js
 * Elimina este archivo después de usarlo.
 */

const bcrypt = require('bcrypt');
const pool = require('./config/db');
require('dotenv').config();

// ── CONFIGURA AQUÍ TUS DATOS ──────────────────────────────
const NOMBRE   = 'Super Administrador';
const EMAIL    = 'superadmin@consultorio.edu.co';
const PASSWORD = 'CambiaEsta123!';
// ──────────────────────────────────────────────────────────

async function crearSuperAdmin() {
  try {
    // Verificar si ya existe
    const check = await pool.query('SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1)', [EMAIL]);
    if (check.rows.length > 0) {
      console.log(`⚠️  Ya existe un usuario con el correo: ${EMAIL}`);
      process.exit(0);
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(PASSWORD, 10);

    // Insertar superadmin
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol)
       VALUES ($1, $2, $3, 'superadmin')
       RETURNING id, nombre, email, rol`,
      [NOMBRE, EMAIL, hash]
    );

    const usuario = result.rows[0];
    console.log('✅ Superadmin creado exitosamente:');
    console.log(`   ID:     ${usuario.id}`);
    console.log(`   Nombre: ${usuario.nombre}`);
    console.log(`   Email:  ${usuario.email}`);
    console.log(`   Rol:    ${usuario.rol}`);
    console.log('\n⚠️  Elimina este archivo (crear_superadmin.js) por seguridad.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

crearSuperAdmin();
