const bcrypt = require('bcrypt');
const pool = require('../config/db');

// GET /api/admins — Listar todos los administradores
const listarAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la lista de administradores' });
  }
};

// POST /api/admins — Crear un nuevo administrador
const crearAdmin = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios' });
  }

  // Solo se permiten los dos roles del sistema
  const rolValido = rol === 'superadmin' ? 'superadmin' : 'admin';

  try {
    const emailCheck = await pool.query(
      'SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese correo' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, hashedPassword, rolValido]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el administrador' });
  }
};

// PUT /api/admins/:id — Editar nombre, email y/o rol de un administrador
const editarAdmin = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, password } = req.body;
  const solicitanteId = req.user.id;

  try {
    const adminResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (adminResult.rows.length === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Verificar email único si cambia
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1) AND id <> $2',
        [email, id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Ese correo ya está en uso por otro usuario' });
      }
    }

    const rolValido = rol === 'superadmin' ? 'superadmin' : 'admin';

    // Si viene nueva contraseña, hashearla
    let updateQuery, updateParams;
    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery = `UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email), rol = $3, password = $4 WHERE id = $5 RETURNING id, nombre, email, rol`;
      updateParams = [nombre, email, rolValido, hashedPassword, id];
    } else {
      updateQuery = `UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email), rol = $3 WHERE id = $4 RETURNING id, nombre, email, rol`;
      updateParams = [nombre, email, rolValido, id];
    }

    const result = await pool.query(updateQuery, updateParams);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al editar el administrador' });
  }
};

// DELETE /api/admins/:id — Eliminar un administrador
const eliminarAdmin = async (req, res) => {
  const { id } = req.params;
  const solicitanteId = req.user.id;

  // Un admin no puede eliminarse a sí mismo
  if (parseInt(id) === solicitanteId) {
    return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
  }

  try {
    const result = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: 'Administrador eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el administrador' });
  }
};

module.exports = { listarAdmins, crearAdmin, editarAdmin, eliminarAdmin };
