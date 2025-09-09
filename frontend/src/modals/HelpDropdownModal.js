import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeadset, FaBookOpen, FaQuestionCircle, FaUsers } from 'react-icons/fa';
import '../styles/HelpDropdownModal.css';

const HELP_OPTIONS = [
  {
    icon: <FaHeadset size={20} style={{marginRight:10}} />, label: 'Soporte', color: '#038effff', // azul claro
    to: '/soporte', external: false
  },
  {
    icon: <FaBookOpen size={20} style={{marginRight:10}} />, label: 'Guía', color: '#0066c0ff', // azul medio
    to: '/guia', external: false
  },
  {
    icon: <FaQuestionCircle size={20} style={{marginRight:10}} />, label: 'Ayuda', color: '#004a87ff', // azul pastel
    to: '/faq', external: false
  },
  {
    icon: <FaUsers size={20} style={{marginRight:10}} />, label: 'Comunidad', color: '#001c3eff', // azul oscuro
    to: 'https://discord.gg/XsTcyd95', external: true
  }
];

const HelpDropdownModal = ({ open, anchorRef, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        (!anchorRef || !anchorRef.current || !anchorRef.current.contains(event.target))
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  // Posicionamiento: justo debajo del anchor
  let style = { position: 'absolute', top: 60, right: 40, zIndex: 2000 };
  if (anchorRef && anchorRef.current) {
    const rect = anchorRef.current.getBoundingClientRect();
    style = {
      position: 'absolute',
      top: rect.bottom + 8 + window.scrollY,
      left: rect.left - 60 + window.scrollX,
      zIndex: 2000
    };
  }

  return (
    <div className="help-dropdown-modal-overlay">
      <div className="help-dropdown-modal" ref={modalRef} style={style}>
  {/* Sin botón de cierre */}
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          {HELP_OPTIONS.map(opt =>
            opt.external ? (
              <a key={opt.label} href={opt.to} target="_blank" rel="noopener noreferrer" className="help-dropdown-btn" style={{background: opt.color}}>
                {opt.icon} {opt.label}
              </a>
            ) : (
              <Link key={opt.label} to={opt.to} className="help-dropdown-btn" style={{background: opt.color}}>
                {opt.icon} {opt.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpDropdownModal;
