const pool = require('../config/db');

// Obtener todos los estudiantes
const obtenerEstudiantes = async (req, res) => {
    try {
        // Tu tabla usa 'fecha_registro' en vez de 'created_at'
        const { rows } = await pool.query('SELECT * FROM estudiantes ORDER BY fecha_registro DESC');
        
        // Formatear los datos para que el Frontend (EstudiantesInscriptos.jsx) los entienda
        const estudiantesFormateados = rows.map(est => {
            // Arreglar el formato de fecha para que envié YYYY-MM-DD sin T ni Z
            let fechaFormateada = '';
            if (est.fecha_nacimiento) {
                const dateObj = new Date(est.fecha_nacimiento);
                fechaFormateada = dateObj.toISOString().split('T')[0];
            }

            return {
                id: est.id,
                iniciales: est.nombre_completo ? est.nombre_completo.charAt(0).toUpperCase() : '?',
                nombres: est.nombre_completo,
                apellidos: '', // Ya va explícito en el nombre completo
                email: est.correo,
                nivel: est.consultorios_realizados || 'I', // Ajustado a tu tabla
                semestre: est.semestre, // Ahora es de tu tabla
                tipoDoc: est.tipo_documento,
                documento: est.numero_documento,
                fechaNacimiento: fechaFormateada,
                eps: 'N/A' // No tienes columna eps en la BD
            };
        });

        res.json(estudiantesFormateados);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener estudiantes' });
    }
};

// Crear un nuevo estudiante (desde el formulario de frontend)
const crearEstudiante = async (req, res) => {
    // IMPORTANTE: En el bloque try-catch empezamos una transacción si algo falla con los archivos
    try {
        const { 
            nombres, apellidos, email, tipoDoc, documento, 
            fechaNacimiento, semestre,
            departamento, municipio, direccion, telefono, correoInstitucional
        } = req.body;

        // Mapeamos los datos del Frontend a las columnas reales de tu BD
        const nombreCompleto = `${nombres || ''} ${apellidos || ''}`.trim();
        const tipoD = tipoDoc && ['CC','TI','CE'].includes(tipoDoc) ? tipoDoc : 'CC';
        const sem = semestre ? parseInt(semestre, 10) : 7;
        const declaracion = true; 

        const nuevoEstudiante = await pool.query(
            `INSERT INTO estudiantes (
                nombre_completo, tipo_documento, numero_documento, 
                fecha_nacimiento, correo, semestre, declara_veracidad, autoriza_datos,
                departamento, municipio, direccion, telefono, correo_institucional
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, nombre_completo`,
            [
                nombreCompleto, tipoD, documento || '000000', fechaNacimiento || '2000-01-01', 
                email || 'sin@correo.com', sem, declaracion, declaracion,
                departamento || null, municipio || null, direccion || null, 
                telefono || null, correoInstitucional || null
            ]
        );

        const estudianteId = nuevoEstudiante.rows[0].id;

        // 2. Insertar los documentos si se recibieron del multer
        if (req.files) {
            const archivosSubidos = [];

            // Mapeo entre los nombres del input (FormData) y los tipos válidos de la tabla SQL
            const mapeoDocumentos = {
                'doc_identidad': 'cedula',
                'doc_eps': 'eps',
                'doc_consentimiento': 'consentimiento',
                'doc_acta': 'acta_compromiso',
                'doc_hoja_vida': 'hoja_vida'
            };

            for (const fieldName in req.files) {
                const archivo = req.files[fieldName][0];
                const tipoValido = mapeoDocumentos[fieldName];
                
                if (tipoValido) {
                    const fileSizeKb = Math.round(archivo.size / 1024);
                    const insertDoc = await pool.query(
                        `INSERT INTO documentos (estudiante_id, tipo, nombre_archivo, ruta_archivo, tamanio_kb)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [estudianteId, tipoValido, archivo.originalname, archivo.path, fileSizeKb]
                    );
                }
            }
        }

        res.status(201).json({ message: "Estudiante y documentos guardados con éxito", estudianteId });
    } catch (error) {
        console.error('Error al crear estudiante y documentos:', error);
        
        // Manejar el error de documento duplicado
        if (error.code === '23505' && error.constraint === 'estudiantes_numero_documento_key') {
            return res.status(400).json({ 
                message: 'El número de documento ingresado ya se encuentra registrado en el sistema.' 
            });
        }

        res.status(500).json({ message: 'Error en el servidor al guardar el estudiante' });
    }
};

// Eliminar un estudiante
const eliminarEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('DELETE FROM estudiantes WHERE id = $1 RETURNING *', [id]);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.status(200).json({ message: 'Estudiante eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ message: 'Error en el servidor al eliminar el estudiante' });
    }
};

module.exports = {
    obtenerEstudiantes,
    crearEstudiante,
    eliminarEstudiante
};
