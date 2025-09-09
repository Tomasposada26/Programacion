const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint para intercambiar el code de Instagram por access token
router.post('/instagram/token', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Falta el parámetro code' });

  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.INSTAGRAM_CLIENT_ID);
    params.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI);
    params.append('code', code);

    const response = await axios.post('https://api.instagram.com/oauth/access_token', params);
    // Responde con el access_token y datos del usuario
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
