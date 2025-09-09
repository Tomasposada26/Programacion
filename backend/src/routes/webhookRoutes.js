const express = require('express');
const router = express.Router();

// Webhook de Instagram (GET para verificación, POST para eventos)
router.get('/instagram', (req, res) => {
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  res.sendStatus(400);
});

router.post('/instagram', (req, res) => {
  // Aquí puedes manejar los eventos recibidos de Instagram
  console.log('Webhook recibido:', req.body);
  res.sendStatus(200);
});

module.exports = router;
