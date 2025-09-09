// Configuración de la base de datos MongoDB
module.exports = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/aura',
  options: {
    // Puedes agregar aquí otras opciones si las necesitas
  }
};
