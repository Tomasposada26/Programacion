import React, { useState, useRef } from 'react';
import './ProductDropdown.css';
import { Link } from 'react-router-dom';

// ...existing code...
const ABOUT_ITEMS = [
  {
    title: 'Comunidad Aura',
    desc: 'Únete a nuestra comunidad y comparte experiencias con otros usuarios de Aura.',
    link: 'https://discord.gg/XsTcyd95',
    external: true
  },
  {
    title: 'Soporte y contacto',
    desc: '¿Tienes dudas o necesitas ayuda? Contáctanos y te responderemos pronto.',
    link: '/soporte'
  },
  {
    title: 'Políticas de privacidad',
    desc: 'Conoce cómo protegemos y gestionamos tus datos personales.',
    link: '/politicasdeprivacidad'
  },
  {
    title: 'Términos y condiciones',
    desc: 'Lee los términos legales para el uso de Aura y sus servicios.',
    link: '/terminosycondiciones'
  },
  {
    title: 'Políticas de eliminación',
    desc: 'Infórmate sobre el proceso y condiciones para eliminar tu cuenta.',
    link: '/politicasdeeliminacion'
  }
];

const AboutDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseLeave = () => setOpen(false);
  const handleMouseEnter = () => setOpen(true);

  // Divide en dos columnas si hay más de 3 items
  const col1 = ABOUT_ITEMS.slice(0, 3);
  const col2 = ABOUT_ITEMS.slice(3);

// ...existing code...
  const renderItem = (item, idx) => (
    <div key={item.title} style={{marginBottom: 12}}>
      {item.link ? (
        item.external ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{fontWeight: 700, fontSize: 16, marginBottom: 2, color: '#188fd9', textDecoration: 'none'}}>{item.title}</a>
        ) : (
          <Link to={item.link} style={{fontWeight: 700, fontSize: 16, marginBottom: 2, color: '#188fd9', textDecoration: 'none'}}>{item.title}</Link>
        )
      ) : (
        <span style={{fontWeight: 700, fontSize: 16, marginBottom: 2}}>{item.title}</span>
      )}
      <div style={{fontWeight: 400, fontSize: 15, color: '#232a3bcc', marginBottom: 2}}>{item.desc}</div>
    </div>
  );

  return (
    <div className="product-dropdown-wrapper" onMouseLeave={handleMouseLeave}>
      <div
        className="product-dropdown-trigger"
        onMouseEnter={handleMouseEnter}
        style={{fontWeight: 700, color: '#fff', background: 'transparent', cursor: 'pointer', padding: '0 18px', fontSize: '1.1em', display: 'inline-block'}}
      >
        Conócenos <span style={{fontWeight: 400, fontSize: '0.9em'}}>▼</span>
      </div>
      {open && (
        <div
          className="product-dropdown-modal"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#fff',
            color: '#232a3b',
            borderRadius: 12,
            boxShadow: '0 8px 32px #0004',
            padding: '28px 36px 28px 36px',
            minWidth: 420,
            zIndex: 1000,
            display: 'flex',
            gap: 48,
            fontFamily: 'inherit',
            fontSize: 16
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, minWidth: 180}}>
            <div style={{color: '#188fd9', fontWeight: 700, letterSpacing: 1, fontSize: 15, marginBottom: 2}}>CONÓCENOS</div>
            {col1.map(renderItem)}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, minWidth: 180}}>
            <div style={{color: 'transparent', fontWeight: 700, fontSize: 15, marginBottom: 2}}>_</div>
            {col2.map(renderItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutDropdown;
