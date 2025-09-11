// Redeploy trigger: 2025-09-11
// Cambio mínimo para limpiar historial
// --- DEPENDENCIAS Y MODELOS ---
require('dotenv').config();
const { connectMongoDB } = require('./src/services/mongoService');
const app = require('./src/app');

connectMongoDB();

// const PORT = process.env.PORT || 4000;
const PORT = 4000; // Puerto fijo para pruebas locales
app.listen(PORT, () => {
  console.log(`Servidor backend de Aura escuchando en puerto ${PORT}`);
});
//app

