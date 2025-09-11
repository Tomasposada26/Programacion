const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const instagramTokenSimController = require('../controllers/instagramTokenSimController');
// Guardar todas las cuentas IG simuladas del usuario (bulk)
router.post('/save-accounts', authMiddleware, instagramTokenSimController.saveUserAccounts);
// Eliminar una cuenta IG simulada por su _id
router.delete('/simulate-link/:id', authMiddleware, instagramTokenSimController.deleteSimulatedAccount);
// Endpoint para simular vinculación de cuenta IG (mock)
router.post('/simulate-link', authMiddleware, instagramTokenSimController.simulateLink);

// Endpoint para obtener cuentas IG simuladas del usuario
router.get('/user-accounts', authMiddleware, instagramTokenSimController.getUserAccounts);

// Endpoint para guardar el access_token recibido tras el login
router.post('/save-token', authMiddleware, async (req, res) => {
  const { app_user_id, instagram_user_id, access_token, expires_in } = req.body;
  if (!app_user_id || !instagram_user_id || !access_token) return res.status(400).json({ error: 'Faltan datos' });
  try {
    let doc = await Instagram.findOne({ app_user_id });
    if (!doc) doc = new Instagram({ app_user_id });
    doc.instagram_user_id = instagram_user_id;
    doc.access_token = access_token;
    doc.expires_in = expires_in;
    doc.last_refresh = new Date();
    await doc.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener el access_token (y refrescarlo si está por expirar)
router.get('/get-token/:app_user_id', authMiddleware, async (req, res) => {
  const { app_user_id } = req.params;
  try {
    const doc = await Instagram.findOne({ app_user_id });
    if (!doc) return res.status(404).json({ error: 'No hay token para este usuario' });
    // Si faltan menos de 24h para expirar, refrescar
    const now = Date.now();
    const expiraEn = doc.last_refresh.getTime() + (doc.expires_in * 1000);
    if (expiraEn - now < 24 * 3600 * 1000) {
      // Refrescar token de larga duración
      const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${doc.access_token}`;
      const response = await axios.get(url);
      doc.access_token = response.data.access_token;
      doc.expires_in = response.data.expires_in;
      doc.last_refresh = new Date();
      await doc.save();
    }
    res.json({ access_token: doc.access_token, expires_in: doc.expires_in });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para eliminar todos los datos de Instagram asociados a un usuario de la app
router.delete('/delete-by-user/:app_user_id', authMiddleware, async (req, res) => {
  const { app_user_id } = req.params;
  try {
    await Instagram.deleteMany({ app_user_id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
