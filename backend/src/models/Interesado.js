const mongoose = require('mongoose');

const InteresadoSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  fecha_suscripcion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interesado', InteresadoSchema);
