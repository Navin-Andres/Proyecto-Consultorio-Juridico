const express = require('express');
const router = express.Router();
const { authMiddleware, requireSuperAdmin } = require('../middleware/auth');
const { listarAdmins, crearAdmin, editarAdmin, eliminarAdmin } = require('../controllers/adminsController');

// Todas las rutas de admins requieren estar autenticado + ser superadmin
router.use(authMiddleware, requireSuperAdmin);

router.get('/', listarAdmins);
router.post('/', crearAdmin);
router.put('/:id', editarAdmin);
router.delete('/:id', eliminarAdmin);

module.exports = router;
