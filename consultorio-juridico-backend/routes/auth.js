const express = require('express');
const router = express.Router();

// Importamos el controlador (fíjate en la "r" extra en la palabra Crontroller)
const authController = require('../controllers/authCrontroller');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;