// Controlador para endpoints utilitarios y demo

// Controlador para endpoints utilitarios y demo

const { mongoose } = require('../services/mongoService');

const hola = (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend de Aura!' });
};

const mongo = async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ mongo: 'Conexión exitosa a MongoDB' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  hola,
  mongo
};