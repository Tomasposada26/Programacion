import React, { useState } from 'react';

const EmailVerifyModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 10, width: 350, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', position: 'relative', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 16, color: '#188FD9' }}>Verificar cuenta</h2>
        <div style={{ marginBottom: 18, color: '#444', fontSize: 15 }}>
          Ingresa el correo que deseas verificar
        </div>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          style={{ width: '100%', padding: 10, marginBottom: 18, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
        />
        <button
          onClick={() => onSubmit(email)}
          style={{ width: '100%', background: '#188FD9', color: '#fff', border: 'none', borderRadius: 6, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 8 }}
        >
          Confirmar
        </button>
        <button
          onClick={onClose}
          style={{ width: '100%', background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: 10, fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EmailVerifyModal;
