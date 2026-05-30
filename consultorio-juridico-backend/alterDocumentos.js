const pool = require('./config/db');

async function run() {
  try {
    console.log("Eliminando restricción antigua...");
    try {
      await pool.query("ALTER TABLE documentos DROP CONSTRAINT documentos_tipo_check");
      console.log("Restricción documentos_tipo_check eliminada.");
    } catch (e) {
      console.log("No se pudo eliminar documentos_tipo_check de forma directa. Buscando nombre real...");
      const res = await pool.query("SELECT conname FROM pg_constraint WHERE conrelid = 'documentos'::regclass AND contype = 'c'");
      if (res.rows.length > 0) {
        const name = res.rows[0].conname;
        console.log(`Eliminando restricción real encontrada: ${name}`);
        await pool.query(`ALTER TABLE documentos DROP CONSTRAINT ${name}`);
        console.log(`Restricción ${name} eliminada.`);
      } else {
        console.log("No se encontró ninguna restricción CHECK en la tabla documentos.");
      }
    }

    console.log("Agregando restricción actualizada...");
    await pool.query(`
      ALTER TABLE documentos ADD CONSTRAINT documentos_tipo_check CHECK (tipo IN (
        'cedula',
        'eps',
        'consentimiento',
        'acta_compromiso',
        'hoja_vida',
        'certificacion_funciones'
      ))
    `);
    console.log("¡Restricción CHECK de documentos actualizada con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("Error al actualizar la base de datos:", err);
    process.exit(1);
  }
}

run();
