import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoAura from '../assets/logo-aura.png';
import '../styles/SoportePanel.css';

const opciones = [
  { value: 'Soporte', label: 'Soporte' },
  { value: 'Queja', label: 'Queja' },
  { value: 'Reclamo', label: 'Reclamo' },
  { value: 'Sugerencia', label: 'Sugerencia' }
];

const SoportePanel = () => {
  const [tipo, setTipo] = useState(opciones[0].value);
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    setEnviado(false);
    try {
      const formData = new FormData();
      formData.append('tipo', tipo);
      formData.append('correo', correo);
      formData.append('asunto', tipo);
      formData.append('mensaje', mensaje);
      if (archivo) formData.append('archivo', archivo);
      // Aquí deberías hacer el fetch a tu backend para enviar el correo
      // await fetch('/api/soporte', { method: 'POST', body: formData });
      setEnviado(true);
    } catch (err) {
      setError('Error al enviar el mensaje. Intenta de nuevo.');
    }
    setEnviando(false);
  };

  return (
    <div className="soporte-panel-container">
      <div className="soporte-panel-header">
        <img src={logoAura} alt="AURA Logo" className="soporte-logo" />
        <div className="soporte-breadcrumbs">
          <Link to="/" className="soporte-link">Inicio</Link>
          <span style={{margin: '0 8px'}}>/</span>
          <span>Soporte y contacto</span>
        </div>
        <Link to="/" className="soporte-volver-btn">&larr; Volver a Aura</Link>
      </div>
      <div className="soporte-panel-content">
        <h2>Soporte y contacto</h2>
        <form className="soporte-form" onSubmit={handleSubmit}>
          <label>Tipo de mensaje</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            {opciones.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label>Tu correo electrónico</label>
          <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required placeholder="ejemplo@correo.com" />
          <label>Asunto</label>
          <input type="text" value={tipo} readOnly disabled style={{background:'#f3f3f3', color:'#888'}} />
          <label>Mensaje</label>
          <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={6} required placeholder="Escribe tu mensaje aquí..." />
          <label>Adjuntar archivo (opcional)</label>
          <input type="file" onChange={handleArchivo} />
          {error && <div className="soporte-error">{error}</div>}
          {enviado && <div className="soporte-exito">¡Mensaje enviado correctamente!</div>}
          <button type="submit" className="soporte-enviar-btn" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar'}</button>
        </form>
      </div>
    </div>
  );
};

export default SoportePanel;
