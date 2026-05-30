const pool = require('./config/db');
pool.query("SELECT pg_get_constraintdef(c.oid) FROM pg_constraint c WHERE c.conname = 'estudiantes_jornada_asignaturas_check'").then(res => { console.log(res.rows); process.exit(0); }).catch(console.error);
