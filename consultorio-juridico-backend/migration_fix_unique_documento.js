/**
 * MIGRACIÓN: Cambiar constraint UNIQUE de numero_documento
 * ──────────────────────────────────────────────────────────
 * ANTES: UNIQUE(numero_documento)        → bloquea reinscripción en nuevos períodos
 * DESPUÉS: UNIQUE(numero_documento, periodo_id) → permite reinscripción en distintos períodos
 *
 * Ejecutar con: node migration_fix_unique_documento.js
 */

require('dotenv').config();
const pool = require('./config/db');

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('🔄 Iniciando migración...');

        await client.query('BEGIN');

        // 1. Verificar si existe el constraint global
        const checkGlobal = await client.query(`
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = 'estudiantes'
              AND constraint_type = 'UNIQUE'
              AND constraint_name = 'estudiantes_numero_documento_key'
        `);

        if (checkGlobal.rows.length > 0) {
            console.log('✅ Encontrado: constraint global "estudiantes_numero_documento_key"');
            await client.query(`
                ALTER TABLE estudiantes
                DROP CONSTRAINT estudiantes_numero_documento_key
            `);
            console.log('🗑️  Eliminado constraint global.');
        } else {
            console.log('ℹ️  No se encontró el constraint global (puede que ya fue eliminado).');
        }

        // 2. Verificar si ya existe el constraint compuesto
        const checkCompuesto = await client.query(`
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = 'estudiantes'
              AND constraint_type = 'UNIQUE'
              AND constraint_name = 'uq_estudiantes_documento_periodo'
        `);

        if (checkCompuesto.rows.length === 0) {
            await client.query(`
                ALTER TABLE estudiantes
                ADD CONSTRAINT uq_estudiantes_documento_periodo
                UNIQUE (numero_documento, periodo_id)
            `);
            console.log('✅ Creado nuevo constraint compuesto: UNIQUE(numero_documento, periodo_id)');
        } else {
            console.log('ℹ️  El constraint compuesto ya existía, no se vuelve a crear.');
        }

        await client.query('COMMIT');
        console.log('\n🎉 Migración completada con éxito.');
        console.log('   → Un mismo estudiante puede ahora inscribirse en diferentes períodos académicos.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error durante la migración:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
