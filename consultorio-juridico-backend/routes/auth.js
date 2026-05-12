const express = require('express');
const router = express.Router();

// Importamos el controlador (fíjate en la "r" extra en la palabra Crontroller)
const authController = require('../controllers/authCrontroller');

// Definimos la ruta y le pasamos la función del controlador
router.post('/login', authController.login);

module.exports = router;