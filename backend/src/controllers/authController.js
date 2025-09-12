// Controlador para login, registro, verificación, recuperación

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const transporter = require('../services/mailerService');
const generarCodigo = require('../utils/generarCodigo');
const { JWT_SECRET } = require('../utils/constants');

// LOGIN
const login = async (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const user = await Usuario.findOne({ $or: [{ usuario }, { correo: usuario }] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (!user.verificado) {
      return res.status(403).json({ error: 'Cuenta no verificada' });
    }
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    user.ultima_conexion = new Date();
    await user.save();
    const token = jwt.sign({ id: user._id, usuario: user.usuario, correo: user.correo }, JWT_SECRET, { expiresIn: '2h' });
    // Buscar cuentas IG vinculadas
    let accounts = [];
    try {
      const InstagramAccount = require('../models/InstagramAccount');
      accounts = await InstagramAccount.find({ userId: user._id });
      console.log('[LOGIN BACKEND] Cuentas IG encontradas:', accounts);
    } catch (e) {
      console.error('[LOGIN BACKEND] Error buscando cuentas IG:', e);
      accounts = [];
    }
    console.log('[LOGIN BACKEND] Respuesta login:', {
      ok: true,
      token,
      usuario: user.usuario,
      correo: user.correo,
      ultimaConexion: user.ultima_conexion,
      accounts
    });
    res.json({
      ok: true,
      token,
      usuario: user.usuario,
      correo: user.correo,
      ultimaConexion: user.ultima_conexion,
      accounts
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el login' });
  }
};

// REGISTRO
const registro = async (req, res) => {
  const { nombre, apellidos, usuario, correo, contrasena } = req.body;
  if (!nombre || !apellidos || !usuario || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    const existeUsuario = await Usuario.findOne({ usuario });
    if (existeUsuario) return res.status(409).json({ error: 'El usuario ya está registrado' });
    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo) return res.status(409).json({ error: 'El correo ya está registrado' });
    const hash = await bcrypt.hash(contrasena, 10);
    const codigo = generarCodigo();
    const nuevoUsuario = new Usuario({
      nombre,
      apellidos,
      usuario,
      correo,
      contrasena: hash,
      verificado: false,
      codigo_verificacion: codigo,
      codigo_verificacion_enviado: new Date()
    });
    await nuevoUsuario.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Verifica tu cuenta en Aura',
      html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
          <tr>
            <td style="background:#188fd9;padding:32px 0;text-align:center;">
              <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Bienvenido a Aura</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 16px 32px;">
              <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${nombre}</b>,</p>
              <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">¡Gracias por unirte a <b>Aura</b>! Para confirmar tu cuenta y mantenerla segura, utiliza el siguiente código de verificación:</p>
              <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
                <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
              </div>
              <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste esta verificación, puedes ignorar este correo.</p>
              <p style="font-size:1em;color:#6366f1;font-weight:600;margin:0 0 12px 0;">Bienvenido a la comunidad Aura ✨</p>
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
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error en el registro' });
  }
};

// VERIFICAR CUENTA
const verificar = async (req, res) => {
  const { correo, codigo } = req.body;
  if (!correo || !codigo) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no registrado' });
    if (user.verificado) return res.status(400).json({ error: 'La cuenta ya está verificada' });
    if (user.codigo_verificacion !== codigo) return res.status(400).json({ error: 'Código incorrecto' });
    user.verificado = true;
    user.codigo_verificacion = null;
    user.codigo_verificacion_enviado = null;
    await user.save();
    res.json({ ok: true, message: 'Tu cuenta se ha verificado, ya puedes iniciar sesión.' });
  } catch (err) {
    console.error('Error al verificar la cuenta:', err);
    res.status(500).json({ error: 'Error al verificar la cuenta' });
  }
};

// RECOVERY REQUEST
const recoveryRequest = async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: 'Correo requerido' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const codigo = generarCodigo();
    user.codigo_recuperacion = codigo;
    user.codigo_recuperacion_enviado = new Date();
    await user.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Recupera tu acceso a Aura: Código de recuperación',
        html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
            <tr>
              <td style="background:#6366f1;padding:32px 0;text-align:center;">
                <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Recupera tu acceso</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 16px 32px;">
                <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${user.nombre}</b>,</p>
                <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Has solicitado recuperar el acceso a tu cuenta en <b>Aura</b>. Utiliza el siguiente código para continuar con el proceso de recuperación:</p>
                <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
                  <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
                </div>
                <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste esta recuperación, puedes ignorar este correo.</p>
                <p style="font-size:1em;color:#6366f1;font-weight:600;margin:0 0 12px 0;">¡Estamos aquí para ayudarte!</p>
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
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al solicitar recuperación:', err);
    res.status(500).json({ error: 'Error al solicitar recuperación' });
  }
};

// RECOVERY RESET
const recoveryReset = async (req, res) => {
  const { correo, contrasena, repetir } = req.body;
  if (!correo || !contrasena || !repetir) return res.status(400).json({ error: 'Faltan datos' });
  if (contrasena !== repetir) return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  // Requisitos: mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
  const isSecure = contrasena.length >= 8 && /[A-Z]/.test(contrasena) && /[a-z]/.test(contrasena) && /[0-9]/.test(contrasena) && /[^A-Za-z0-9]/.test(contrasena);
  if (!isSecure) return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const nuevaHash = await bcrypt.hash(contrasena, 10);
    user.contrasena = nuevaHash;
    user.codigo_recuperacion = undefined;
    user.codigo_recuperacion_enviado = undefined;
    await user.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Contraseña restablecida en Aura',
      html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
          <tr>
            <td style="background:#6366f1;padding:32px 0;text-align:center;">
              <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Contraseña restablecida</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 16px 32px;">
              <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${user.nombre}</b>,</p>
              <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>
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
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al restablecer contraseña:', err);
    res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};

// REENVIAR VERIFICACION
const reenviarVerificacion = async (req, res) => {
  const { correo } = req.body;
  if (!correo) {
    return res.status(400).json({ error: 'Correo requerido' });
  }
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no registrado' });
    if (user.verificado) {
      return res.status(400).json({ error: 'Usuario ya verificado, puedes iniciar sesión' });
    }
    const codigo = generarCodigo();
    user.codigo_verificacion = codigo;
    user.codigo_verificacion_enviado = new Date();
    await user.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Tu nuevo código de verificación para Aura',
      html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
          <tr>
            <td style="background:#6366f1;padding:32px 0;text-align:center;">
              <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Reenvío de código</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 16px 32px;">
              <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${user.nombre}</b>,</p>
              <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Has solicitado un nuevo código de verificación para tu cuenta en <b>Aura</b>. Utiliza el siguiente código para continuar con la verificación:</p>
              <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
                <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
              </div>
              <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste este reenvío, puedes ignorar este correo.</p>
              <p style="font-size:1em;color:#6366f1;font-weight:600;margin:0 0 12px 0;">¡Gracias por confiar en Aura!</p>
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
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al reenviar verificación:', err);
    res.status(500).json({ error: 'Error al reenviar el correo de verificación' });
  }
};

// RECOVERY VERIFY
const recoveryVerify = async (req, res) => {
  const { correo, codigo } = req.body;
  if (!correo || !codigo) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.codigo_recuperacion !== codigo) return res.status(400).json({ error: 'Código incorrecto' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al verificar código de recuperación:', err);
    res.status(500).json({ error: 'Error al verificar código' });
  }
};

module.exports = {
  login,
  registro,
  verificar,
  recoveryRequest,
  recoveryVerify,
  recoveryReset,
  reenviarVerificacion
};