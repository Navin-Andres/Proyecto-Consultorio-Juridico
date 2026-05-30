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
        
        // Manejar el error de documento duplicado
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

module.exports = {
    obtenerEstudiantes,
    crearEstudiante,
    eliminarEstudiante
};
