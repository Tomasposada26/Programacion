// Obtener notificaciones de un usuario
exports.obtenerNotificaciones = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Falta userId' });
    }
    const notificaciones = await Notificacion.find({ userId }).sort({ date: -1 });
    res.json(notificaciones);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error: err.message });
  }
};
const Notificacion = require('../models/Notificacion');

// Guarda un array de notificaciones para un usuario, eliminando las previas
exports.guardarNotificaciones = async (req, res) => {
  try {
    const { userId, notificaciones } = req.body;
    if (!userId || !Array.isArray(notificaciones)) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
    // Elimina notificaciones previas del usuario
    await Notificacion.deleteMany({ userId });
    // Guarda cada notificación asociada al usuario
    const docs = await Notificacion.insertMany(
      notificaciones.map(n => ({ ...n, userId }))
    );
    res.status(201).json({ message: 'Notificaciones guardadas (previas eliminadas)', docs });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar notificaciones', error: err.message });
  }
};
