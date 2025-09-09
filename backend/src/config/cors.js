// Configuración de CORS
module.exports = {
  origin: [process.env.FRONTEND_URL || 'https://programacion-tau.vercel.app', 'http://localhost:3000'],
  credentials: true
};
