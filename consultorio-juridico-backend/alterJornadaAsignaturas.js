const pool = require('./config/db');

async function run() {
  try {
    console.log("Eliminando restricción antigua de jornada_asignaturas...");
    try {
      await pool.query("ALTER TABLE estudiantes DROP CONSTRAINT estudiantes_jornada_asignaturas_check");
      console.log("Restricción estudiantes_jornada_asignaturas_check eliminada.");
    } catch (e) {
      console.log("No se pudo eliminar estudiantes_jornada_asignaturas_check de forma directa. Buscando nombre real...");
      const res = await pool.query("SELECT conname FROM pg_constraint WHERE conrelid = 'estudiantes'::regclass AND conname LIKE '%jornada%'");
      if (res.rows.length > 0) {
        const name = res.rows[0].conname;
        console.log(`Eliminando restricción real encontrada: ${name}`);
        await pool.query(`ALTER TABLE estudiantes DROP CONSTRAINT ${name}`);
        console.log(`Restricción ${name} eliminada.`);
      } else {
        console.log("No se encontró ninguna restricción CHECK de jornada en la tabla estudiantes.");
      }
    }

    console.log("Agregando restricción actualizada...");
    await pool.query(`
      ALTER TABLE estudiantes ADD CONSTRAINT estudiantes_jornada_asignaturas_check CHECK (jornada_asignaturas IN (
        'mañana',
        'tarde',
        'noche',
        'sabatina',
        'virtual',
        'diurna',
        'nocturna'
      ))
    `);
    console.log("¡Restricción CHECK de jornada_asignaturas actualizada con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("Error al actualizar la base de datos:", err);
    process.exit(1);
  }
}

run();
