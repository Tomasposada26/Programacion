import React from 'react';
import './SettingsPanel.css';
import ModernSwitch from './ModernSwitch';
import { useTranslation } from 'react-i18next';

const SettingsPanel = ({ visible, anchorRef, onClose, onLanguageChange, notificationsEnabled, setNotificationsEnabled, darkMode, setDarkMode, onSupport }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = React.useState(() => i18n.language || 'es');

  if (!visible || !anchorRef?.current) return null;

  // Get button position
  const rect = anchorRef.current.getBoundingClientRect();
  // Centrar respecto a la barra lateral (260px de ancho)
  const sidebarWidth = 260;
  // Corrección: desplazar 20px más a la izquierda
  const style = {
    position: 'fixed',
    left: rect.left + (sidebarWidth - 240) / 2 - 20, // 20px más a la izquierda
    bottom: window.innerHeight - rect.top + 16, // baja 32px (4 espacios aprox)
    zIndex: 2000,
    transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
  };

  return (
    <div className="settings-panel" style={style}>
      <div className="settings-panel-content">
        <h4 style={{color:'#1e6fd9'}}>{t('settings.title')}</h4>
        <ul>
          <li style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{t('settings.darkMode')}</span>
            <ModernSwitch checked={darkMode} onChange={()=>setDarkMode(v=>!v)} />
          </li>
          <li style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
            <span>{t('settings.language')}</span>
            <select value={language} onChange={e=>{
              setLanguage(e.target.value);
              i18n.changeLanguage(e.target.value);
              if (onLanguageChange) onLanguageChange();
            }} style={{borderRadius:4,padding:'0 4px', fontSize:'0.92rem', height:'22px', minWidth:'70px', maxWidth:'90px'}}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </li>
          <li style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
            <span>{t('settings.notifications')}</span>
            <ModernSwitch checked={notificationsEnabled} onChange={()=>setNotificationsEnabled(v=>!v)} />
          </li>
          <li style={{marginTop:8}}>
            <button type="button" style={{color:'#1e6fd9',textDecoration:'underline',fontWeight:600,background:'none',border:'none',padding:0,cursor:'pointer',fontSize:'1rem'}}
              onClick={onSupport}
            >
              {t('settings.support')}
            </button>
          </li>
        </ul>
        <button className="settings-close" onClick={onClose}>{t('settings.close')}</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
