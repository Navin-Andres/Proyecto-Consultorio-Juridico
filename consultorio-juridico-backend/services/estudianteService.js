const pool = require('../config/db');

// Helper function to format 12h time
function formatTime12h(timeStr) {
    if (!timeStr) return '';
    const [hourStr, minStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minStr} ${ampm}`;
}

const getEstudiantesFormateados = async () => {
    // Query to join with asignaciones, turnos and documentos
    const { rows } = await pool.query(`
        SELECT e.*, t.id as turno_id, t.dia as turno_dia, t.jornada as turno_jornada, t.hora_inicio, t.hora_fin,
               p.nombre as periodo_nombre,
               (
                 SELECT json_agg(json_build_object('tipo', d.tipo, 'ruta', d.ruta_archivo))
                 FROM documentos d WHERE d.estudiante_id = e.id
               ) as documentos_anexos
        FROM estudiantes e
        LEFT JOIN asignaciones a ON e.id = a.estudiante_id
        LEFT JOIN turnos t ON a.turno_id = t.id
        LEFT JOIN periodos_academicos p ON e.periodo_id = p.id
        ORDER BY e.fecha_registro DESC
    `);

    // Formatear los datos para que el Frontend (EstudiantesInscriptos.jsx) los entienda
    return rows.map(est => {
        // Arreglar el formato de fecha para que envié YYYY-MM-DD sin T ni Z
        let fechaFormateada = '';
        if (est.fecha_nacimiento) {
            const dateObj = new Date(est.fecha_nacimiento);
            fechaFormateada = dateObj.toISOString().split('T')[0];
        }

        let turnoTextoObj = { dia: 'Sin asignar', detalle: '' };
        if (est.turno_dia) {
            const diaCapitalizado = est.turno_dia.charAt(0).toUpperCase() + est.turno_dia.slice(1);
            const jornadaCapitalizada = est.turno_jornada.charAt(0).toUpperCase() + est.turno_jornada.slice(1);
            turnoTextoObj = {
                dia: diaCapitalizado,
                detalle: `${jornadaCapitalizada} (${formatTime12h(est.hora_inicio)} - ${formatTime12h(est.hora_fin)})`
            };
        }

        return {
            id: est.id,
            iniciales: est.nombre_completo ? est.nombre_completo.charAt(0).toUpperCase() : '?',
            nombres: est.nombre_completo,
            apellidos: '', // Ya va explícito en el nombre completo
            email: est.correo,
            nivel: est.consultorio || 'I',
            semestre: est.semestre,
            tipoDoc: est.tipo_documento,
            documento: est.numero_documento,
            fechaNacimiento: fechaFormateada,
            eps: est.eps || 'N/A',
            residencia: est.direccion || 'N/A',
            departamento: est.departamento || 'N/A',
            municipio: est.municipio || 'N/A',
            municipio_depto: (est.municipio || 'N/A') + ' / ' + (est.departamento || 'N/A'),
            telefono: est.telefono || 'N/A',
            correoInstitucional: est.correo_institucional || 'N/A',
            jornadaAsignaturas: est.jornada_asignaturas || 'N/A',
            areaInteres: est.area_interes || 'N/A',
            consultoriosRealizados: est.consultorios_realizados || '0',
            consultorioExterno: est.consultorio_externo || '0',
            radicados: est.radicados || 'N/A',
            trabaja: est.trabaja ? 'Sí' : 'No',
            empresa: est.empresa || 'N/A',
            cargo: est.cargo || 'N/A',
            turnoObj: turnoTextoObj,
            turnoId: est.turno_id || null,
            periodo: est.periodo_nombre || '',
            anexos: est.documentos_anexos || []
        };
    });
};

const registrarEstudiante = async (data, files) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            nombres, apellidos, email, tipoDoc, documento,
            fechaNacimiento, semestre,
            departamento, municipio, direccion, telefono, correoInstitucional, eps,
            jornada_asignaturas, turnoId,
            consultorio_inscrito, area_interes, consultorios_realizados, consultorio_externo, radicados,
            trabaja, empresa, cargo
        } = data;

        // Mapeamos los datos del Frontend a las columnas reales de tu BD
        const nombreCompleto = `${nombres || ''} ${apellidos || ''}`.trim();
        const tipoD = tipoDoc && ['CC', 'TI', 'CE'].includes(tipoDoc) ? tipoDoc : 'CC';
        const sem = semestre ? parseInt(semestre, 10) : 7;
        const declaracion = true;
        const trabajaBoolean = trabaja === 'true' || trabaja === true;

        // Fix for Check Constraint: 'manana' to 'mañana'
        let jornadaDb = jornada_asignaturas || null;
        if (jornadaDb === 'manana') jornadaDb = 'mañana';

        // Mapeo seguro de consultorios_realizados (sede) para cumplir constraint CHECK (0, 1, 2, 3, 4+)
        let consultoriosRealizadosDb = '0';
        const valSede = String(consultorios_realizados || '').trim();
        if (['0', '1', '2', '3', '4+'].includes(valSede)) {
            consultoriosRealizadosDb = valSede;
        } else {
            const numSede = parseInt(valSede, 10);
            if (!isNaN(numSede)) {
                if (numSede <= 0) consultoriosRealizadosDb = '0';
                else if (numSede === 1) consultoriosRealizadosDb = '1';
                else if (numSede === 2) consultoriosRealizadosDb = '2';
                else if (numSede === 3) consultoriosRealizadosDb = '3';
                else consultoriosRealizadosDb = '4+';
            } else {
                // fallback based on enrolled level
                if (consultorio_inscrito === 'I') consultoriosRealizadosDb = '0';
                else if (consultorio_inscrito === 'II') consultoriosRealizadosDb = '1';
                else if (consultorio_inscrito === 'III') consultoriosRealizadosDb = '2';
                else if (consultorio_inscrito === 'IV') consultoriosRealizadosDb = '3';
            }
        }

        // Mapeo seguro de área de interés para cumplir constraints
        let areaInteresDb = area_interes || null;
        if (area_interes === 'conciliacion') areaInteresDb = 'conciliacion_penal';
        else if (area_interes === 'asistencia') areaInteresDb = 'asistencia_legal';

        // 1. Obtener periodo_id del turno o el periodo activo actual
        let periodoId = null;
        if (turnoId && turnoId !== 'null' && turnoId !== '') {
            const turnoRes = await client.query(
                'SELECT periodo_id, cupos_totales, cupos_ocupados, activo FROM turnos WHERE id = $1 FOR UPDATE',
                [turnoId]
            );

            if (turnoRes.rows.length === 0) {
                throw new Error('El turno seleccionado no existe.');
            }

            const turno = turnoRes.rows[0];
            if (!turno.activo) {
                throw new Error('El turno seleccionado no está activo.');
            }

            if (turno.cupos_ocupados >= turno.cupos_totales) {
                throw new Error('El turno seleccionado ya no tiene cupos disponibles.');
            }

            periodoId = turno.periodo_id;
        } else {
            const periodoRes = await client.query(
                'SELECT id FROM periodos_academicos WHERE activo = true LIMIT 1'
            );
            if (periodoRes.rows.length > 0) {
                periodoId = periodoRes.rows[0].id;
            }
        }

        const nuevoEstudiante = await client.query(
            `INSERT INTO estudiantes (
                nombre_completo, tipo_documento, numero_documento, 
                fecha_nacimiento, correo, semestre, declara_veracidad, autoriza_datos,
                departamento, municipio, direccion, telefono, correo_institucional,
                jornada_asignaturas, periodo_id, consultorios_realizados, consultorio_externo, area_interes, radicados,
                consultorio, eps, trabaja, empresa, cargo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING id, nombre_completo`,
            [
                nombreCompleto, tipoD, documento || '000000', fechaNacimiento || '2000-01-01',
                email || 'sin@correo.com', sem, declaracion, declaracion,
                departamento || null, municipio || null, direccion || null,
                telefono || null, correoInstitucional || null,
                jornadaDb, periodoId, consultoriosRealizadosDb, String(consultorio_externo || '0'), areaInteresDb, radicados || null,
                consultorio_inscrito || 'I',
                eps || null,
                trabajaBoolean, empresa || null, cargo || null
            ]
        );

        const estudianteId = nuevoEstudiante.rows[0].id;

        // 2. Si hay turnoId, crear la asignación y actualizar cupos
        if (turnoId && turnoId !== 'null' && turnoId !== '') {
            // Insertar asignación
            await client.query(
                `INSERT INTO asignaciones (estudiante_id, turno_id, periodo_id) VALUES ($1, $2, $3)`,
                [estudianteId, turnoId, periodoId]
            );

            // Incrementar cupos_ocupados
            await client.query(
                `UPDATE turnos SET cupos_ocupados = cupos_ocupados + 1 WHERE id = $1`,
                [turnoId]
            );
        }

        // 3. Insertar los documentos si se recibieron del multer
        if (files) {
            // Mapeo entre los nombres del input (FormData) y los tipos válidos de la tabla SQL
            const mapeoDocumentos = {
                'doc_identidad': 'cedula',
                'doc_eps': 'eps',
                'doc_consentimiento': 'consentimiento',
                'doc_acta': 'acta_compromiso',
                'doc_hoja_vida': 'hoja_vida',
                'doc_certificacion_funciones': 'certificacion_funciones'
            };

            for (const fieldName in files) {
                const archivo = files[fieldName][0];
                const tipoValido = mapeoDocumentos[fieldName];

                if (tipoValido) {
                    const fileSizeKb = Math.round(archivo.size / 1024);
                    await client.query(
                        `INSERT INTO documentos (estudiante_id, tipo, nombre_archivo, ruta_archivo, tamanio_kb)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [estudianteId, tipoValido, archivo.originalname, archivo.path, fileSizeKb]
                    );
                }
            }
        }

        await client.query('COMMIT');
        return estudianteId;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const borrarEstudiante = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Buscar si tenía un turno asignado antes de eliminar
        const asignacionRes = await client.query(
            'SELECT turno_id FROM asignaciones WHERE estudiante_id = $1',
            [id]
        );

        let turnoId = null;
        if (asignacionRes.rows.length > 0) {
            turnoId = asignacionRes.rows[0].turno_id;
        }

        // 2. Eliminar el estudiante (las asignaciones se eliminan en cascada gracias a ON DELETE CASCADE)
        const resultado = await client.query('DELETE FROM estudiantes WHERE id = $1 RETURNING *', [id]);

        if (resultado.rowCount === 0) {
            await client.query('ROLLBACK');
            throw new Error('Estudiante no encontrado');
        }

        // 3. Decrementar cupos si tenía turno asignado
        if (turnoId) {
            await client.query(
                'UPDATE turnos SET cupos_ocupados = GREATEST(0, cupos_ocupados - 1) WHERE id = $1',
                [turnoId]
            );
        }

        await client.query('COMMIT');
        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getEstudiantesFormateados,
    registrarEstudiante,
    borrarEstudiante
};
