// Rutas para login, registro, verificación, recuperación
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/registro', authController.registro);
router.post('/verificar', authController.verificar);
router.post('/recovery/request', authController.recoveryRequest);
router.post('/recovery/verify', authController.recoveryVerify);
router.post('/recovery/reset', authController.recoveryReset);
router.post('/reenviar-verificacion', authController.reenviarVerificacion);

module.exports = router;
