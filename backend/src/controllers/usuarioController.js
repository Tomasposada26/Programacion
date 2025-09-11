const Usuario = require('../models/Usuario');
const Instagram = require('../models/InstagramAccount');

const usuarioController = {
  async delete(req, res) {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: 'Falta el correo' });
    try {
      const user = await Usuario.findOne({ correo });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      // Eliminar notificaciones y reglas asociadas
      const Notificacion = require('../models/Notificacion');
      const Regla = require('../models/Regla');
  await Notificacion.deleteMany({ userId: user._id.toString() });
  await Regla.deleteMany({ userId: user._id.toString() });
  // Eliminar datos de Instagram asociados a este usuario
  await Instagram.deleteMany({ app_user_id: user._id });
      await Usuario.deleteOne({ correo });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  },
  async getInfo(req, res) {
    const { usuario } = req.query;
    if (!usuario) return res.status(400).json({ error: 'Falta el parámetro usuario' });
    try {
      const user = await Usuario.findOne({ $or: [{ usuario }, { correo: usuario }] });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({
        _id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        username: user.usuario,
        email: user.correo,
        ultimaConexion: user.ultima_conexion,
        ciudad: user.ciudad,
        pais: user.pais,
        genero: user.genero,
        fecha_nacimiento: user.fecha_nacimiento,
        edad: user.edad
      });
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },
  async update(req, res) {
    // Permitir actualizar todos los campos de perfil
    const { nombre, apellidos, correo, ciudad, pais, genero, fecha_nacimiento, edad } = req.body;
    if (!nombre || !apellidos || !correo) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    try {
      const user = await Usuario.findOne({ correo });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      user.nombre = nombre;
      user.apellidos = apellidos;
      user.ciudad = ciudad;
      user.pais = pais;
      user.genero = genero;
      user.fecha_nacimiento = fecha_nacimiento;
      user.edad = edad;
      await user.save();
      res.json({ ok: true });
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
};

module.exports = usuarioController;
