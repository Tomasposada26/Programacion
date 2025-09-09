const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	id: { type: String, required: true }, // id único de la notificación
	text: { type: String, required: true },
	date: { type: Date, required: true },
	leida: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);
