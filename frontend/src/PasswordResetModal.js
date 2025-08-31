import React, { useState, useEffect } from 'react';
import EyeIcon from './assets/EyeIcon';
// import Spinner from './assets/Spinner';


const PasswordResetModal = ({ isOpen, onClose, onReset, email, errorMsg, step }) => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  // Contador regresivo
  useEffect(() => {
    if (step !== 'code') return;
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer, step]);

  // Reenviar código
  const handleResendCode = () => {
    setCanResend(false);
    setTimer(60);
    window.dispatchEvent(new CustomEvent('reenviar-codigo-recovery', { detail: email }));
    setCode('');
  };
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  const isPasswordSecure = pw =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);

  const handleCodeSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await onReset(code);
    setLoading(false);
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setLocalError('');
    if (!isPasswordSecure(password)) {
      setLocalError('La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo.');
      return;
    }
    if (password !== repeat) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
  const res = await fetch('/api/reenviar-codigo/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, repeat })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess(true);
        setLocalError('');
      } else {
        setLocalError(data.error || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setLocalError('Error de red');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
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
          width: 370,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          position: 'relative',
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>
          {step === 'newpass' ? 'Restablece tu contraseña' : 'Recuperar contraseña'}
        </h2>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          {step === 'code'
            ? <span>Ingresa el código de recuperación enviado a <b>{email}</b></span>
            : <span>Elige una nueva contraseña segura para tu cuenta.</span>
          }
        </div>
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} aria-label="Formulario de código de recuperación">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
              {[0,1,2,3,4,5].map(i => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    let newCode = code.split('');
                    newCode[i] = val;
                    setCode(newCode.join(''));
                    // Focus siguiente caja
                    if (val && i < 5) {
                      document.getElementById(`code-box-${i+1}`)?.focus();
                    }
                  }}
                  id={`code-box-${i}`}
                  style={{
                    width: 40,
                    height: 48,
                    fontSize: 28,
                    textAlign: 'center',
                    border: '2px solid #6366f1',
                    borderRadius: 8,
                    outline: 'none',
                    background: '#f8f8ff',
                  }}
                  autoFocus={i === 0}
                  required
                />
              ))}
            </div>
            <button type="submit" style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }} disabled={loading}>
              Verificar código
            </button>
            <div style={{ textAlign: 'center', color: '#888', fontSize: 15, marginTop: 10 }}>
              {canResend ? (
                <button type="button" style={{ color: '#6366f1', background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 500, fontSize: 15, cursor: 'pointer', padding: 0 }} onClick={handleResendCode}>
                  Reenviar nuevo código
                </button>
              ) : (
                <>Puedes reenviar código en {timer}s</>
              )}
            </div>
          </form>
        )}
        {step === 'newpass' && !success && (
          <form onSubmit={handlePasswordSubmit} aria-label="Formulario de cambio de contraseña">
            <label htmlFor="reset-password" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Nueva contraseña</label>
            <div style={{ position: 'relative', marginBottom: 10, width: '100%' }}>
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 38px 8px 8px' }}
                placeholder="Nueva contraseña"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: 24, display: 'flex', alignItems: 'center' }}
                tabIndex={0}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <label htmlFor="reset-confirm" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Repetir contraseña</label>
            <div style={{ position: 'relative', marginBottom: 10, width: '100%' }}>
              <input
                id="reset-confirm"
                type={showRepeat ? 'text' : 'password'}
                value={repeat}
                onChange={e => setRepeat(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 38px 8px 8px' }}
                placeholder="Repite la contraseña"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowRepeat(v => !v)}
                style={{ position: 'absolute', right: 12, top: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: 24, display: 'flex', alignItems: 'center' }}
                tabIndex={0}
                aria-label={showRepeat ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon open={showRepeat} />
              </button>
            </div>
            {localError && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">{localError}</div>}
            <button type="submit" style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }} disabled={loading}>
              Cambiar contraseña
            </button>
          </form>
        )}
        {success && (
          <div style={{ color: '#22c55e', fontWeight: 500, textAlign: 'center', fontSize: 16 }}>
            ¡Contraseña cambiada exitosamente! Ya puedes iniciar sesión.
          </div>
        )}
        {errorMsg && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">{errorMsg}</div>}
      </div>
    </div>
  );
};

export default PasswordResetModal;
