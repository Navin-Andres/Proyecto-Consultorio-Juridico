const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const sql = `
-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  rol VARCHAR(20) DEFAULT 'admin' CHECK (rol IN ('admin', 'superadmin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. PERÍODOS ACADÉMICOS
CREATE TABLE IF NOT EXISTS periodos_academicos (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre VARCHAR(50) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  activo BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. TURNOS
CREATE TABLE IF NOT EXISTS turnos (
  id SERIAL PRIMARY KEY,
  periodo_id INTEGER REFERENCES periodos_academicos(id) ON DELETE CASCADE,
  admin_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  dia VARCHAR(20) NOT NULL CHECK (dia IN ('lunes','martes','miercoles','jueves','viernes')),
  jornada VARCHAR(20) NOT NULL CHECK (jornada IN ('mañana','tarde')),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  cupos_totales INTEGER NOT NULL DEFAULT 11,
  cupos_ocupados INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(periodo_id, dia, jornada)
);

-- 4. ESTUDIANTES
CREATE TABLE IF NOT EXISTS estudiantes (
  id SERIAL PRIMARY KEY,
  periodo_id INTEGER REFERENCES periodos_academicos(id) ON DELETE SET NULL,
  nombre_completo VARCHAR(150) NOT NULL,
  tipo_documento VARCHAR(20) NOT NULL CHECK (tipo_documento IN ('CC','TI','CE')),
  numero_documento VARCHAR(20) UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo VARCHAR(100) NOT NULL,
  correo_institucional VARCHAR(100),
  telefono VARCHAR(20),
  departamento VARCHAR(100),
  municipio VARCHAR(100),
  direccion TEXT,
  jornada_asignaturas VARCHAR(20) CHECK (jornada_asignaturas IN ('mañana','tarde','noche','sabatina','virtual','diurna','nocturna')),
  semestre INTEGER CHECK (semestre BETWEEN 1 AND 10),
  consultorios_realizados VARCHAR(10) CHECK (consultorios_realizados IN ('0','1','2','3','4+')),
  radicados TEXT,
  area_interes VARCHAR(100) CHECK (area_interes IN (
    'penal','publico','privado','familia','animal',
    'laboral','ddhh','agrario','investigacion',
    'consumo','conciliacion_penal','asistencia_legal',
    'purpura','tierra'
  )),
  trabaja BOOLEAN DEFAULT false,
  empresa VARCHAR(150),
  cargo VARCHAR(100),
  declara_veracidad BOOLEAN DEFAULT false NOT NULL,
  autoriza_datos BOOLEAN DEFAULT false NOT NULL,
  observaciones_personales TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobado','rechazado')),
  observaciones_admin TEXT,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- 5. ASIGNACIONES
CREATE TABLE IF NOT EXISTS asignaciones (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER REFERENCES estudiantes(id) ON DELETE CASCADE,
  turno_id INTEGER REFERENCES turnos(id) ON DELETE CASCADE,
  periodo_id INTEGER REFERENCES periodos_academicos(id) ON DELETE CASCADE,
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  UNIQUE(estudiante_id, periodo_id)
);

-- 6. DOCUMENTOS
CREATE TABLE IF NOT EXISTS documentos (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER REFERENCES estudiantes(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
    'cedula','eps','consentimiento','acta_compromiso','hoja_vida','certificacion_funciones'
  )),
  nombre_archivo VARCHAR(200) NOT NULL,
  ruta_archivo VARCHAR(300) NOT NULL,
  tamanio_kb INTEGER,
  fecha_subida TIMESTAMP DEFAULT NOW()
);

-- 7. HISTORIAL DE ESTADOS
CREATE TABLE IF NOT EXISTS historial_estados (
  id SERIAL PRIMARY KEY,
  estudiante_id INTEGER REFERENCES estudiantes(id) ON DELETE CASCADE,
  admin_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  estado_anterior VARCHAR(20),
  estado_nuevo VARCHAR(20),
  observacion TEXT,
  fecha_cambio TIMESTAMP DEFAULT NOW()
);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Conectando a Railway PostgreSQL...');
    await client.query(sql);
    console.log('✅ Tablas creadas exitosamente.');

    // Verificar si ya existe el usuario admin
    const { rows } = await client.query("SELECT id FROM usuarios WHERE email = 'admin@consultorio.edu.co'");
    if (rows.length === 0) {
      // Crear usuario admin con contraseña hasheada (bcrypt de "admin123")
      await client.query(`
        INSERT INTO usuarios (nombre, email, password, rol)
        VALUES ('Administrador', 'admin@consultorio.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin')
      `);
      console.log('✅ Usuario admin creado. Email: admin@consultorio.edu.co | Password: admin123');
    } else {
      console.log('ℹ️  Usuario admin ya existe.');
    }
  } catch (err) {
    console.error('❌ Error en la migración:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
