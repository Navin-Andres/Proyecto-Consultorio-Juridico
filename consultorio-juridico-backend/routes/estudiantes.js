const express = require('express');
const router = express.Router();
const multer = require('multer');
const { obtenerEstudiantes, crearEstudiante, eliminarEstudiante } = require('../controllers/estudiantesController');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Asegúrate de crear una carpeta "uploads" dentro de "consultorio-juridico-backend"
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({ storage: storage });

// Configuramos las llaves de los archivos (tienen que coincidir con el Frontend)
const documentosEsperados = upload.fields([
  { name: 'doc_identidad', maxCount: 1 },
  { name: 'doc_eps', maxCount: 1 },
  { name: 'doc_consentimiento', maxCount: 1 },
  { name: 'doc_acta', maxCount: 1 },
  { name: 'doc_hoja_vida', maxCount: 1 }
]);

// Ruta para obtener todos los estudiantes (GET /api/estudiantes)
router.get('/', obtenerEstudiantes);

// Ruta para crear un estudiante (POST /api/estudiantes)
router.post('/', documentosEsperados, crearEstudiante);

// Ruta para eliminar un estudiante (DELETE /api/estudiantes/:id)
router.delete('/:id', eliminarEstudiante);

module.exports = router;
