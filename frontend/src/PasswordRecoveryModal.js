import React, { useState } from 'react';
import Spinner from './assets/Spinner';

const PasswordRecoveryModal = ({ isOpen, onClose, onSendRecovery, errorMsg }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setLoading(false);
      setSent(false);
    }
  }, [isOpen]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await onSendRecovery(email);
    setLoading(false);
    setSent(true);
  };

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
        <h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>Recuperar contraseña</h2>
        {sent ? (
          <div style={{ color: '#22c55e', fontWeight: 500, textAlign: 'center', fontSize: 16 }}>
            ¡Correo enviado! Revisa tu bandeja de entrada y sigue el enlace para cambiar tu contraseña.
          </div>
        ) : (
          <form onSubmit={handleSubmit} aria-label="Formulario de recuperación de contraseña">
            <label htmlFor="recovery-email" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Correo electrónico</label>
            <input
              id="recovery-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: 8, marginBottom: 10 }}
              placeholder="Ingresa tu correo registrado"
              required
              autoFocus
              aria-label="Correo electrónico"
            />
            {errorMsg && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">{errorMsg}</div>}
            <button
              type="submit"
              style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <Spinner size={22} color="#fff" /> : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordRecoveryModal;
