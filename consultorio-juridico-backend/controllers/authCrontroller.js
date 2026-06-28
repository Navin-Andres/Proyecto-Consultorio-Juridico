const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    res.json({ token, user: { name: user.nombre, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al obtener el perfil' });
  }
};

const updateProfile = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailCheck = await pool.query('SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1) AND id <> $2', [email, userId]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso por otro usuario' });
      }
      await pool.query('UPDATE usuarios SET email = $1 WHERE id = $2', [email, userId]);
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);
    }

    res.json({ message: 'Perfil actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el perfil' });
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile
};