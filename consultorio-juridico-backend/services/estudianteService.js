const pool = require('../config/db');
const {
    mapDbEstudianteToFrontend,
    mapFrontendDataToDb,
    mapConsultarEstudiante
} = require('./estudianteMapper');

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

    // Formatear los datos usando el mapper
    return rows.map(mapDbEstudianteToFrontend);
};

const registrarEstudiante = async (data, files) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Mapeamos los datos del Frontend a variables del Backend usando el mapper
        const mapped = mapFrontendDataToDb(data);

        // 1. Obtener periodo_id del turno o el periodo activo actual
        let periodoId = null;
        const { turnoId } = data;
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
                mapped.nombreCompleto, mapped.tipoD, mapped.documento, mapped.fechaNacimiento,
                mapped.email, mapped.sem, true, true, // declara y autoriza
                mapped.departamento, mapped.municipio, mapped.direccion,
                mapped.telefono, mapped.correoInstitucional,
                mapped.jornadaDb, periodoId, mapped.consultoriosRealizadosDb, mapped.consultorioExterno, mapped.areaInteresDb, mapped.radicados,
                mapped.consultorioInscrito,
                mapped.eps,
                mapped.trabajaBoolean, mapped.empresa, mapped.cargo
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

const consultarEstudiantePorDocumentoOCorreo = async (identificacion) => {
    const queryStr = identificacion.trim();
    const { rows } = await pool.query(`
        SELECT e.id, e.nombre_completo, e.numero_documento, e.correo, e.correo_institucional, 
               e.estado, e.observaciones_admin, e.fecha_registro, e.semestre, e.consultorio,
               t.dia as turno_dia, t.jornada as turno_jornada, t.hora_inicio, t.hora_fin,
               p.nombre as periodo_nombre
        FROM estudiantes e
        LEFT JOIN asignaciones a ON e.id = a.estudiante_id
        LEFT JOIN turnos t ON a.turno_id = t.id
        LEFT JOIN periodos_academicos p ON e.periodo_id = p.id
        WHERE e.numero_documento = $1 OR e.correo_institucional = $1 OR e.correo = $1
        ORDER BY e.fecha_registro DESC
        LIMIT 1
    `, [queryStr]);

    if (rows.length === 0) {
        return null;
    }

    return mapConsultarEstudiante(rows[0]);
};

const actualizarEstado = async (id, estado, observacionesAdmin) => {
    const { rows } = await pool.query(
        `UPDATE estudiantes 
         SET estado = $1, observaciones_admin = $2, fecha_actualizacion = NOW() 
         WHERE id = $3 
         RETURNING *`,
        [estado, observacionesAdmin, id]
    );
    if (rows.length === 0) {
        throw new Error('Estudiante no encontrado');
    }
    return rows[0];
};

module.exports = {
    getEstudiantesFormateados,
    registrarEstudiante,
    borrarEstudiante,
    consultarEstudiantePorDocumentoOCorreo,
    actualizarEstado
};
