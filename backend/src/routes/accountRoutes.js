const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Instagram accounts
router.post('/instagram-accounts/guardar', accountController.guardarInstagramAccounts);
router.get('/instagram-accounts', accountController.obtenerInstagramAccounts);

// Account notifications
router.post('/account-notifications/guardar', accountController.guardarAccountNotifications);
router.get('/account-notifications', accountController.obtenerAccountNotifications);

module.exports = router;
