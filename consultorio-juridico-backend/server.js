// consultorio-juridico-backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas separadas
const authRoutes = require('./routes/auth');
const periodosRoutes = require('./routes/periodos');
const turnosRoutes = require('./routes/turnos');

const app = express();
app.use(express.json());
app.use(cors());

// Definir los prefijos para las rutas
app.use('/api/admin', authRoutes);
app.use('/api/periodos', periodosRoutes);
app.use('/api/turnos', turnosRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));