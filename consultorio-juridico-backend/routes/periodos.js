const express = require('express');
const router = express.Router();
const periodosController = require('../controllers/periodosControllers');

router.get('/', periodosController.obtenerPeriodos);
router.post('/', periodosController.crearPeriodo);
router.put('/:id/activar', periodosController.activarPeriodo);
router.put('/:id', periodosController.actualizarPeriodo);
router.delete('/:id', periodosController.eliminarPeriodo);

module.exports = router;