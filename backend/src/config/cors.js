// Configuración de CORS
// Permitir orígenes locales y de producción (Vercel) y cualquier combinación
const allowedOrigins = [
  'https://programacion-tau.vercel.app', // Frontend en producción (Vercel)
  'http://localhost:3000',               // Frontend en desarrollo local
  process.env.FRONTEND_URL               // Personalizable por variable de entorno
].filter(Boolean);

module.exports = {
  origin: function (origin, callback) {
    // Permite peticiones sin origin (como Postman) o desde los orígenes permitidos
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS: ' + origin));
    }
  },
  credentials: true
};
