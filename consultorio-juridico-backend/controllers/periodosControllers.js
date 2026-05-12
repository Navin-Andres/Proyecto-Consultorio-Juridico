const pool = require('../config/db');

const obtenerPeriodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM periodos_academicos ORDER BY fecha_inicio DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener periodos' });
  }
};

const crearPeriodo = async (req, res) => {
  const { nombre, fecha_inicio, fecha_fin } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO periodos_academicos (nombre, fecha_inicio, fecha_fin) VALUES ($1, $2, $3) RETURNING *',
      [nombre, fecha_inicio, fecha_fin]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el periodo' });
  }
};

const activarPeriodo = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    await client.query('UPDATE periodos_academicos SET activo = false');
    const result = await client.query(
      'UPDATE periodos_academicos SET activo = true WHERE id = $1 RETURNING *',
      [id]
    );
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el periodo' });
  } finally {
    client.release();
  }
};

const actualizarPeriodo = async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_inicio, fecha_fin } = req.body;
  try {
    const result = await pool.query(
      'UPDATE periodos_academicos SET nombre = $1, fecha_inicio = $2, fecha_fin = $3 WHERE id = $4 RETURNING *',
      [nombre, fecha_inicio, fecha_fin, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el periodo' });
  }
};

const eliminarPeriodo = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM periodos_academicos WHERE id = $1', [id]);
    res.json({ message: 'Periodo eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el periodo' });
  }
};

module.exports = {
  obtenerPeriodos,
  crearPeriodo,
  activarPeriodo,
  actualizarPeriodo,
  eliminarPeriodo
};