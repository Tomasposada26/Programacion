
// Cambio mínimo para forzar redeploy en Render
const express = require('express');
const axios = require('axios');
const router = express.Router();
// Actualizar expiresAt de una cuenta IG simulada
const authMiddleware = require('../middlewares/authMiddleware');
const instagramTokenSimController = require('../controllers/instagramTokenSimController');
const Instagram = require('../models/InstagramAccount'); // Corregido: modelo correcto

router.patch('/update-expiry/:id', authMiddleware, instagramTokenSimController.updateExpiry);

// ---------------------------------------------------------------------------
// RUTAS PARA CUENTAS SIMULADAS (mock)
// ---------------------------------------------------------------------------

// Guardar cuentas IG simuladas en lote (por ejemplo al cerrar sesión)
router.post('/bulk-save', authMiddleware, instagramTokenSimController.bulkSaveAccounts);

// Simular vinculación de cuenta IG
router.post('/simulate-link', authMiddleware, instagramTokenSimController.simulateLink);

// Obtener cuentas simuladas del usuario autenticado
router.get('/user-accounts', authMiddleware, instagramTokenSimController.getUserAccounts);

// Eliminar una cuenta simulada por su id
router.delete('/simulate-link/:id', authMiddleware, instagramTokenSimController.deleteSimulatedAccount);

// ---------------------------------------------------------------------------
// RUTAS PARA TOKENS REALES DE INSTAGRAM
// ---------------------------------------------------------------------------

// Guardar / actualizar access_token tras login (token de larga duración)
router.post('/save-token', authMiddleware, async (req, res) => {
  try {
    const { app_user_id, instagram_user_id, access_token, expires_in } = req.body;
    if (!app_user_id || !instagram_user_id || !access_token) {
      return res.status(400).json({ success: false, error: 'Faltan datos obligatorios.' });
    }

    // (Opcional) Validar que app_user_id coincida con req.user.id si tu lógica lo requiere:
    // if (app_user_id !== req.user.id) return res.status(403).json({ success: false, error: 'Operación no permitida.' });

    let doc = await Instagram.findOne({ app_user_id });
    if (!doc) doc = new Instagram({ app_user_id });

    doc.instagram_user_id = instagram_user_id;
    doc.access_token = access_token;
    doc.expires_in = typeof expires_in === 'number' ? expires_in : doc.expires_in;
    doc.last_refresh = new Date();

    await doc.save();

    return res.json({ success: true, data: { app_user_id } });
  } catch (err) {
    console.error('save-token error:', err);
    return res.status(500).json({ success: false, error: 'Error guardando token.' });
  }
});

// Obtener token y refrescar si faltan < 24h de vigencia
router.get('/get-token/:app_user_id', authMiddleware, async (req, res) => {
  const { app_user_id } = req.params;
  try {
    const doc = await Instagram.findOne({ app_user_id });
    if (!doc) {
      return res.status(404).json({ success: false, error: 'No hay token para este usuario.' });
    }

    const now = Date.now();
    const lastRefresh = doc.last_refresh ? doc.last_refresh.getTime() : 0;
    const expiraEnMs = lastRefresh + (doc.expires_in * 1000);

    // Si queda menos de 24 horas, intentamos refrescar
    if (doc.access_token && expiraEnMs - now < 24 * 3600 * 1000) {
      try {
        const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${doc.access_token}`;
        const response = await axios.get(refreshUrl);
        if (response.data?.access_token) {
          doc.access_token = response.data.access_token;
          doc.expires_in = response.data.expires_in;
          doc.last_refresh = new Date();
          await doc.save();
        }
      } catch (refreshErr) {
        console.warn('No se pudo refrescar el token, se devuelve el actual:', refreshErr.message);
        // No cortamos la respuesta; devolvemos el token actual
      }
    }

    return res.json({
      success: true,
      data: {
        access_token: doc.access_token,
        expires_in: doc.expires_in,
        last_refresh: doc.last_refresh
      }
    });
  } catch (err) {
    console.error('get-token error:', err);
    return res.status(500).json({ success: false, error: 'Error obteniendo token.' });
  }
});

// Eliminar todos los tokens / datos de Instagram de un usuario
router.delete('/delete-by-user/:app_user_id', authMiddleware, async (req, res) => {
  const { app_user_id } = req.params;
  try {
    // (Opcional) Validar ownership:
    // if (app_user_id !== req.user.id) return res.status(403).json({ success: false, error: 'No autorizado.' });

    const result = await Instagram.deleteMany({ app_user_id });
    return res.json({ success: true, data: { deleted: result.deletedCount } });
  } catch (err) {
    console.error('delete-by-user error:', err);
    return res.status(500).json({ success: false, error: 'Error eliminando datos.' });
  }
});

module.exports = router;