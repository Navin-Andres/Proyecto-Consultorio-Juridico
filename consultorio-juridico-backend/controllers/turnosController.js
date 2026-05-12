// controllers/turnosController.js
const pool = require('../config/db');

const obtenerTurnos = async (req, res) => {
  try {
    // Ejemplo: const result = await pool.query('SELECT * FROM turnos');
    // res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener turnos' });
  }
};

const crearTurno = async (req, res) => {
  // Lógica de creación de turno aquí
};

module.exports = {
  obtenerTurnos,
  crearTurno
};