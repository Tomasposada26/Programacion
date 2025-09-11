import React, { useState } from 'react';
import Spinner from '../assets/Spinner';
import googleIcon from '../assets/google-icon.svg';
import EyeIcon from '../assets/EyeIcon';


const RegisterModal = ({ isOpen, onClose, onRegister, errorMsg }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    correo: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Estados de validación en tiempo real
  const [touched, setTouched] = useState({
    nombre: false,
    apellidos: false,
    usuario: false,
    correo: false,
    contrasena: false
  });
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Validaciones individuales
  const isValidNombre = form.nombre.trim().length > 1;
  const isValidApellidos = form.apellidos.trim().length > 1;
  const isValidUsuario = /^[a-zA-Z0-9_]{4,}$/.test(form.usuario);
  const isValidCorreo = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo);
  const isValidContrasena = isPasswordSecure(form.contrasena);
  const firstInputRef = React.useRef(null);
  const modalRef = React.useRef(null);

  // Focus first input when modal opens
  React.useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap and Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('input,button,[tabindex]:not([tabindex="-1"])');
        const focusableArr = Array.from(focusable).filter(el => !el.disabled && el.tabIndex !== -1);
        if (focusableArr.length === 0) return;
        const first = focusableArr[0];
        const last = focusableArr[focusableArr.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
  };


  // Validación de contraseña segura
  function isPasswordSecure(pw) {
    return pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    // Validación básica
    if (!form.nombre || !form.apellidos || !form.usuario || !form.correo || !form.contrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (!isPasswordSecure(form.contrasena)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
      return;
    }
    setError('');
    setLoading(true);
    await onRegister(form);
    setLoading(false);
  };

  // Animación suave para el modal
  // Lógica para Google OAuth
  const handleGoogleRegister = () => {
    const clientId = '130837705730-qotegc29noaned5m19qapvvr2ene29q5.apps.googleusercontent.com';
    const redirectUri = 'https://programacion-tau.vercel.app/'; // Cambia esto por la URL real de tu frontend
    const scope = 'profile email';
    const responseType = 'code';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account`;
    // Abrir ventana emergente
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
  window.open(url, 'google_oauth', `width=${width},height=${height},left=${left},top=${top}`);
    // Escuchar el mensaje del callback
    window.addEventListener('message', function handler(e) {
      if (e.data && e.data.type === 'google_oauth_code') {
        // Aquí puedes enviar e.data.code al backend para intercambiarlo por el token y datos del usuario
        // Por ahora solo cerramos el modal
        onClose();
        window.removeEventListener('message', handler);
      }
    });
  };

  return (
    <div
      ref={modalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: isOpen ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: isOpen ? 'auto' : 'none',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1)'
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          width: 400,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          position: 'relative',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>Registro</h2>
        <button
          onClick={handleGoogleRegister}
          style={{
            width: '100%',
            background: '#fff',
            color: '#444',
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '10px 0',
            fontWeight: 500,
            fontSize: 18,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            cursor: 'pointer',
            boxShadow: 'none',
            outline: 'none',
            transition: 'box-shadow 0.2s',
          }}
        >
          <img src={googleIcon} alt="Google" style={{ width: 22, height: 22, marginRight: 8, display: 'inline-block' }} />
          <span style={{ fontWeight: 500, fontSize: 17 }}>Registrarse con Google</span>
        </button>
  <form onSubmit={handleSubmit} style={{ marginTop: 8 }} aria-label="Formulario de registro" autoComplete="on">
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="register-nombre" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Nombre</label>
            <input
              id="register-nombre"
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: 8, border: touched.nombre && !isValidNombre ? '2px solid #e53e3e' : undefined }}
              ref={firstInputRef}
              aria-label="Nombre"
              autoComplete="given-name"
              required
              aria-invalid={touched.nombre && !isValidNombre}
            />
            {touched.nombre && !isValidNombre && (
              <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 4 }} role="alert">El nombre debe tener al menos 2 caracteres.</div>
            )}
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="register-apellidos" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Apellidos</label>
            <input
              id="register-apellidos"
              name="apellidos"
              type="text"
              placeholder="Apellidos"
              value={form.apellidos}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: 8, border: touched.apellidos && !isValidApellidos ? '2px solid #e53e3e' : undefined }}
              aria-label="Apellidos"
              autoComplete="family-name"
              required
              aria-invalid={touched.apellidos && !isValidApellidos}
            />
            {touched.apellidos && !isValidApellidos && (
              <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 4 }} role="alert">Los apellidos deben tener al menos 2 caracteres.</div>
            )}
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="register-usuario" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Usuario</label>
            <input
              id="register-usuario"
              name="usuario"
              type="text"
              placeholder="Usuario"
              value={form.usuario}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: 8, border: touched.usuario && !isValidUsuario ? '2px solid #e53e3e' : undefined }}
              aria-label="Usuario"
              autoComplete="username"
              required
              aria-invalid={touched.usuario && !isValidUsuario}
            />
            {touched.usuario && !isValidUsuario && (
              <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 4 }} role="alert">El usuario debe tener al menos 4 caracteres y solo letras, números o guion bajo.</div>
            )}
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="register-correo" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Correo electrónico</label>
            <input
              id="register-correo"
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: 8, border: touched.correo && !isValidCorreo ? '2px solid #e53e3e' : undefined }}
              aria-label="Correo electrónico"
              autoComplete="email"
              required
              aria-invalid={touched.correo && !isValidCorreo}
            />
            {touched.correo && !isValidCorreo && (
              <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 4 }} role="alert">Ingresa un correo electrónico válido.</div>
            )}
          </div>
          <div style={{ marginBottom: 10, position: 'relative', width: '100%' }}>
            <label htmlFor="register-contrasena" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Contraseña</label>
            <input
              id="register-contrasena"
              name="contrasena"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 38px 8px 8px', border: touched.contrasena && !isValidContrasena ? '2px solid #e53e3e' : undefined }}
              aria-label="Contraseña"
              autoComplete="new-password"
              required
              aria-invalid={touched.contrasena && !isValidContrasena}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: 12, top: 32, background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: 24, display: 'flex', alignItems: 'center' }}
              tabIndex={0}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {touched.contrasena && !isValidContrasena && (
            <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">
              La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
            </div>
          )}
          {error && <div style={{ color: 'red', marginBottom: 10, width: '100%' }} role="alert">{error}</div>}
          {errorMsg && <div style={{ color: 'red', marginBottom: 10, width: '100%' }} role="alert">{errorMsg}</div>}
          <button
            type="submit"
            style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <Spinner size={22} color="#fff" /> : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
