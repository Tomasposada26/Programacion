import React from 'react';

const InstagramLinkCard = ({ isLinked, onLink, onUnlink, instagramUser, loading }) => (
  <div style={{
    width: 320,
    height: 320,
    background: '#f5faff',
    borderRadius: 18,
    boxShadow: '0 2px 12px #2196f311',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  }}>
    <img src={require('../assets/instagram-icon.png')} alt="Instagram" style={{ width: 56, height: 56, marginBottom: 16 }} />
    <div style={{ fontWeight: 700, fontSize: 20, color: '#183b54', marginBottom: 8 }}>
      Vincula tu cuenta de Instagram
    </div>
    <div style={{ color: '#4a6375', fontSize: 15, marginBottom: 24, textAlign: 'center' }}>
      Conecta tu cuenta para acceder a funciones exclusivas.
    </div>
    {/* Mostrar botón solo si no hay cuenta vinculada */}
    <button
      onClick={onLink}
      disabled={loading}
      style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, cursor: 'pointer' }}
    >
      {loading ? 'Vinculando...' : 'Vincular cuenta de Instagram'}
    </button>
  </div>
);

export default InstagramLinkCard;
