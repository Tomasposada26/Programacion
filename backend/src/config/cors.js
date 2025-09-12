// Configuración de CORS
module.exports = {
  origin: [
    'https://programacion-tau.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
};
