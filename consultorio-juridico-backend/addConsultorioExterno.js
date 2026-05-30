const pool = require('./config/db');

async function run() {
  try {
    console.log("Agregando columna consultorio_externo a la tabla estudiantes...");
    await pool.query("ALTER TABLE estudiantes ADD COLUMN IF NOT EXISTS consultorio_externo VARCHAR(255) DEFAULT '0'");
    console.log("¡Columna consultorio_externo agregada con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("Error al alterar la tabla estudiantes:", err);
    process.exit(1);
  }
}

run();
