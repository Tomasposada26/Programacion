const mongoose = require('mongoose');

const categoriasValidas = [
  'vacantes', 'reuniones', 'eventos',
  'vacancies', 'meetings', 'events'
];
const tiposInteraccionValidos = [
  'like', 'comentario', 'compartido',
  'like', 'comment', 'share'
];

const ReglaSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: {
    type: String,
    enum: ['all', 'post', 'reel', 'story', 'todos', 'publicación', 'reel', 'historia'],
    default: '-'
  },
  tipoInteraccion: {
    type: String,
    enum: tiposInteraccionValidos,
    required: true
  },
  categorias: [{
    type: String,
    enum: categoriasValidas,
    required: true
  }],
  respuestaAutomatica: {
    type: String,
    required: true
  },
  notasInternas: {
    type: String
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva'],
    default: 'activa'
  }
}, { timestamps: true });

module.exports = mongoose.model('Regla', ReglaSchema);
