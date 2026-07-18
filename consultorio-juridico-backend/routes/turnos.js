const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET all turnos
router.get('/', async (req, res) => {
  try {
    // Join with periodos to get its name
    const result = await pool.query(`
      SELECT t.*, p.nombre as periodo_nombre 
      FROM turnos t 
      JOIN periodos_academicos p ON t.periodo_id = p.id 
      ORDER BY p.id DESC, 
        CASE t.dia 
          WHEN 'lunes' THEN 1 
          WHEN 'martes' THEN 2 
          WHEN 'miercoles' THEN 3 
          WHEN 'jueves' THEN 4 
          WHEN 'viernes' THEN 5 
        END,
        t.jornada, t.hora_inicio
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener turnos' });
  }
});

// POST new turno
router.post('/', async (req, res) => {
  const { periodo_id, dia, jornada, hora_inicio, hora_fin, cupos_totales } = req.body;
  // TODO: We could add admin_id later when tracking login tokens properly
  try {
    const result = await pool.query(
      `INSERT INTO turnos (periodo_id, dia, jornada, hora_inicio, hora_fin, cupos_totales) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [periodo_id, dia, jornada, hora_inicio, hora_fin, cupos_totales || 11]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    // Control unique constraint error from Postgres (code 23505)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ya existe un turno para este periodo, día y jornada.' });
    }
    res.status(500).json({ message: 'Error al crear el turno' });
  }
});

// PUT (Edit) turno
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { hora_inicio, hora_fin, cupos_totales, activo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE turnos 
       SET hora_inicio = $1, hora_fin = $2, cupos_totales = $3, activo = $4 
       WHERE id = $5 RETURNING *`,
      [hora_inicio, hora_fin, cupos_totales, activo, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el turno' });
  }
});

// DELETE turno
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM turnos WHERE id = $1', [id]);
    res.json({ message: 'Turno eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el turno' });
  }
});

module.exports = router;