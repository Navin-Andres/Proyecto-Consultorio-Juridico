// consultorio-juridico-backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rutas separadas
const authRoutes = require('./routes/auth');
const periodosRoutes = require('./routes/periodos');
const turnosRoutes = require('./routes/turnos');
const estudiantesRoutes = require('./routes/estudiantes');

const app = express();
app.use(express.json());
app.use(cors());

// Servir la carpeta de subida de archivos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definir los prefijos para las rutas
app.use('/api/admin', authRoutes);
app.use('/api/periodos', periodosRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/estudiantes', estudiantesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});