// src/services/mongoService.js
const mongoose = require('mongoose');
const dbConfig = require('../config/database');

function connectMongoDB() {
  mongoose.connect(dbConfig.uri, dbConfig.options)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error('Error de conexión a MongoDB Atlas:', err));
}

module.exports = {
  mongoose,
  connectMongoDB
};
