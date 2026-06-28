const estudianteService = require('../services/estudianteService');

// Obtener todos los estudiantes
const obtenerEstudiantes = async (req, res) => {
    try {
        const estudiantesFormateados = await estudianteService.getEstudiantesFormateados();
        res.json(estudiantesFormateados);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener estudiantes' });
    }
};

// Crear un nuevo estudiante y su asignación de turno
const crearEstudiante = async (req, res) => {
    try {
        const estudianteId = await estudianteService.registrarEstudiante(req.body, req.files);
        res.status(201).json({ message: "Estudiante y asignación de turno guardados con éxito", estudianteId });
    } catch (error) {
        console.error('Error al crear estudiante, asignación y documentos:', error);
        
        // Manejar el error de documento duplicado o correo institucional duplicado
        if (error.code === 'DUP_DOCUMENTO') {
            return res.status(400).json({ 
                message: 'El número de documento ingresado ya se encuentra registrado en el sistema.' 
            });
        }

        if (error.code === 'DUP_CORREO') {
            return res.status(400).json({ 
                message: 'El correo institucional ingresado ya se encuentra registrado en el sistema.' 
            });
        }

        if (error.code === '23505' && error.constraint === 'estudiantes_numero_documento_key') {
            return res.status(400).json({ 
                message: 'El número de documento ingresado ya se encuentra registrado en el sistema.' 
            });
        }

        res.status(500).json({ message: error.message || 'Error en el servidor al guardar el estudiante' });
    }
};

// Eliminar un estudiante y actualizar los cupos
const eliminarEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        await estudianteService.borrarEstudiante(id);
        res.status(200).json({ message: 'Estudiante eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        if (error.message === 'Estudiante no encontrado') {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.status(500).json({ message: 'Error en el servidor al eliminar el estudiante' });
    }
};

// Consultar un estudiante por documento o correo (público)
const consultarEstudiante = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Debe proporcionar un número de documento o correo electrónico' });
        }
        const estudiante = await estudianteService.consultarEstudiantePorDocumentoOCorreo(query);
        if (!estudiante) {
            return res.status(404).json({ message: 'No se encontró ningún estudiante registrado con los datos proporcionados.' });
        }
        res.json(estudiante);
    } catch (error) {
        console.error('Error al consultar estudiante:', error);
        res.status(500).json({ message: 'Error en el servidor al consultar el estado de la inscripción' });
    }
};

// Actualizar el estado y observaciones de un estudiante (administrador)
const actualizarEstadoEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, observaciones_admin } = req.body;
        
        if (!['pendiente', 'aprobado', 'rechazado'].includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }
        
        await estudianteService.actualizarEstado(id, estado, observaciones_admin);
        res.json({ message: 'Estado del estudiante actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar estado del estudiante:', error);
        if (error.message === 'Estudiante no encontrado') {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.status(500).json({ message: 'Error en el servidor al actualizar el estado' });
    }
};

module.exports = {
    obtenerEstudiantes,
    crearEstudiante,
    eliminarEstudiante,
    consultarEstudiante,
    actualizarEstadoEstudiante
};
