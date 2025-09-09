import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../assets/Spinner';
import googleIcon from '../assets/google-icon.svg';
import EyeIcon from '../assets/EyeIcon';

// URL del backend desde variable de entorno
const BACKEND_URL = process.env.REACT_APP_API_URL || '';

const LoginModal = ({ isOpen, onClose, onLogin, errorMsg, onOpenRecovery, onOpenVerifyEmail }) => {
  console.log('BACKEND_URL:', BACKEND_URL);
  const [form, setForm] = useState(() => {
    let usuario = '';
    let contrasena = '';
    let recuerdame = false;
    const saved = localStorage.getItem('aura_recuerdame_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        if (parsed.timestamp && now - parsed.timestamp < 2 * 60 * 60 * 1000) { // 2 horas
          usuario = parsed.usuario || '';
          contrasena = parsed.contrasena || '';
          recuerdame = true;
        } else {
          localStorage.removeItem('aura_recuerdame_data');
        }
      } catch {}
    }
    return { usuario, contrasena, recuerdame };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // Estados de validación en tiempo real
  const [touched, setTouched] = React.useState({ usuario: false, contrasena: false });

  // Validaciones
  const isValidUsuario = form.usuario.trim().length > 2;
  const isValidContrasena = form.contrasena.length >= 6;
  const firstInputRef = React.useRef(null);
  const modalRef = React.useRef(null);


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
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const [verificarPendiente, setVerificarPendiente] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    // Llamada al backend para login
    try {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: form.usuario, contrasena: form.contrasena })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Cuenta no verificada') {
          setVerificarPendiente(true);
          // NO enviar código aquí, solo mostrar el enlace para verificar
          toast.error('Cuenta no verificada, por favor verifícala para ingresar');
        } else {
          toast.error(data.error || 'Error al iniciar sesión');
        }
        setLoading(false);
        return;
      }
      // Guardar sesión si el usuario marcó "Recuérdame" (por 2 horas)
      if (form.recuerdame) {
        localStorage.setItem('aura_recuerdame_data', JSON.stringify({
          usuario: form.usuario,
          contrasena: form.contrasena,
          timestamp: Date.now()
        }));
      } else {
        localStorage.removeItem('aura_recuerdame_data');
      }
  setLoading(false);
  onLogin(data);
    } catch (err) {
      window.toast && window.toast('Error de conexión con el servidor', { type: 'error' });
      setLoading(false);
    }
  };

  // Animación suave para el modal
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
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          width: 430,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          position: 'relative',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
  <h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700, marginLeft: 8 }}>Iniciar sesión</h2>
        <button
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
          <span style={{ fontWeight: 500, fontSize: 17 }}>Continuar con Google</span>
        </button>
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} aria-label="Formulario de inicio de sesión">
          <div style={{ width: '100%', marginBottom: 10 }}>
            <label htmlFor="login-usuario" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Usuario o correo</label>
            <input
              id="login-usuario"
              name="usuario"
              placeholder="Ingrese usuario o correo"
              value={form.usuario}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 38px 8px 8px', border: touched.usuario && !isValidUsuario ? '2px solid #e53e3e' : '1px solid #222', fontSize: 16, borderRadius: 6, transition: 'border 0.2s' }}
              ref={firstInputRef}
              aria-label="Usuario o correo"
              autoComplete="username"
              required
              aria-invalid={touched.usuario && !isValidUsuario}
            />
            {touched.usuario && !isValidUsuario && (
              <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 4 }} role="alert">Ingresa tu usuario o correo (mínimo 3 caracteres).</div>
            )}
          </div>
          <div style={{ width: '100%', position: 'relative', marginBottom: 10 }}>
            <label htmlFor="login-contrasena" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Contraseña</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                id="login-contrasena"
                name="contrasena"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa contraseña"
                value={form.contrasena}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 38px 8px 8px', border: touched.contrasena && !isValidContrasena ? '2px solid #e53e3e' : undefined, fontSize: 16, borderRadius: 6, transition: 'border 0.2s' }}
                aria-label="Contraseña"
                autoComplete="current-password"
                required
                aria-invalid={touched.contrasena && !isValidContrasena}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: 28, width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                tabIndex={0}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {touched.contrasena && !isValidContrasena && (
              <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 4 }} role="alert">La contraseña debe tener al menos 6 caracteres.</div>
            )}
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <input
              id="login-recuerdame"
              name="recuerdame"
              type="checkbox"
              checked={form.recuerdame}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="login-recuerdame" style={{ fontSize: 15, color: '#222', fontWeight: 500, cursor: 'pointer' }}>
              Recuérdame
            </label>
          </div>
          {/* Captcha eliminado temporalmente */}
          {errorMsg && <div style={{ color: 'red', marginBottom: 10, width: '100%', textAlign: 'center' }} role="alert">{errorMsg}</div>}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <button
              type="submit"
              style={{ background: '#1EB7D9', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 160, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <Spinner size={22} color="#fff" /> : 'Iniciar sesión'}
            </button>
          </div>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          {verificarPendiente && (
            <span onClick={() => onOpenVerifyEmail(form.usuario)} style={{ color: '#6366f1', textDecoration: 'underline', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginRight: 'auto' }}>
              Verificar cuenta
            </span>
          )}
          <button type="button" onClick={onOpenRecovery} style={{ color: '#6366f1', background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 500, fontSize: 15, cursor: 'pointer', padding: 0, marginLeft: 'auto' }}>¿Olvidaste tu contraseña?</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
