// src/controllers/interesadoController.js
const Interesado = require('../models/Interesado');
const transporter = require('../services/mailerService');

const interesadoController = {
  async subscribe(req, res) {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: 'Correo requerido' });
    try {
      let existente = await Interesado.findOne({ correo });
      if (existente) {
        // Si ya existe, no enviar correo, solo responder
        return res.status(200).json({ ok: false, message: 'Correo ya registrado' });
      }
      const nuevo = new Interesado({ correo });
      await nuevo.save();
      await transporter.sendMail({
        from: 'Aura <aurainstacms@gmail.com>',
        to: correo,
        subject: '¡Gracias por tu interés en Aura!',
        html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
            <tr>
              <td style="background:#188fd9;padding:32px 0;text-align:center;">
                <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Aura</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 16px 32px;">
                <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">¡Gracias por suscribirte!</p>
                <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Pronto recibirás novedades y recursos exclusivos sobre automatización y Aura.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
                Saludos,<br>El equipo de Aura
              </td>
            </tr>
          </table>
        </div>`
      });
      res.json({ ok: true, message: '¡Suscripción exitosa! Revisa tu correo.' });
    } catch (err) {
      console.error('Error al registrar interesado:', err);
      res.status(500).json({ error: 'No se pudo registrar el interesado' });
    }
  }
};

module.exports = interesadoController;
