const pool = require('./config/db');
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'documentos'").then(res => { 
    console.log("Columns:", res.rows);
    return pool.query("SELECT pg_get_constraintdef(c.oid) FROM pg_constraint c WHERE c.conrelid = 'documentos'::regclass");
}).then(res => {
    console.log("Constraints:", res.rows);
    process.exit(0);
}).catch(console.error);
