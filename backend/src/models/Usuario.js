const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  verificado: { type: Boolean, default: false },
  codigo_recuperacion: { type: String },
  codigo_recuperacion_enviado: { type: Date },
  codigo_verificacion: { type: String },
  codigo_verificacion_enviado: { type: Date },
  ultima_conexion: { type: Date },
  ciudad: { type: String },
  pais: { type: String },
  genero: { type: String },
  fecha_nacimiento: { type: String },
  edad: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
