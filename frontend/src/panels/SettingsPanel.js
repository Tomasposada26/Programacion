
import React from 'react';
import '../styles/SettingsPanel.css';
import ModernSwitch from '../components/ModernSwitch';

const SettingsPanel = ({ visible, anchorRef, onClose, notificationsEnabled, setNotificationsEnabled, darkMode, setDarkMode, onSupport }) => {
  const panelRef = React.useRef(null);

  // Calcular rect y style aunque no se muestre
  let rect = { left: 0, top: 0, width: 0 };
  if (anchorRef?.current) {
    rect = anchorRef.current.getBoundingClientRect();
  }
  const modalWidth = 280;
  const style = {
    position: 'fixed',
    left: rect.left + rect.width / 2 - modalWidth / 2,
    top: rect.top - modalWidth - 12 + 100,
    width: modalWidth,
    zIndex: 2000,
    transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
  };

  React.useEffect(() => {
    if (!visible) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose && onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, onClose]);

  if (!visible || !anchorRef?.current) return null;

  return (
    <div ref={panelRef} className="settings-panel" style={style}>
      <div className="settings-panel-content">
        <h4 style={{color:'#1e6fd9'}}>Configuración</h4>
        <ul>
          <li style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
            <span>Activar Notificaciones</span>
            <ModernSwitch checked={notificationsEnabled} onChange={()=>setNotificationsEnabled(v=>!v)} />
          </li>
          <li style={{marginTop:8}}>
            <button type="button" style={{color:'#1e6fd9',textDecoration:'underline',fontWeight:600,background:'none',border:'none',padding:0,cursor:'pointer',fontSize:'1rem'}}
              onClick={onSupport}
            >
              Soporte técnico
            </button>
          </li>
        </ul>
        <button className="settings-close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
