import React from 'react';

import '../styles/AuraPanel.css';
import logoAura from '../assets/logo-aura.png';
import aLogo from '../assets/a-logo.png';
import AnimatedRobot from '../assets/AnimatedRobot';


import ProfileIcon from '../assets/ProfileIcon';
import ProfileModalWrapper from '../modals/ProfileModalWrapper';
import BellIcon from '../assets/BellIcon';
import BellDropdownModal from '../modals/BellDropdownModal';
import HelpIcon from '../assets/HelpIcon';
import HelpDropdownModal from '../modals/HelpDropdownModal';
import DashboardPanel from './DashboardPanel';
import TendenciasPanel from './TendenciasPanel';
import RespuestasPanel from './RespuestasPanel';
import PruebaNetoPanel from './PruebaNetoPanel';
import SettingsPanel from './SettingsPanel';
import HomeIcon from '../assets/HomeIcon';
import DashboardIcon from '../assets/DashboardIcon';
import TrendsIcon from '../assets/TrendsIcon';
import ChatIcon from '../assets/ChatIcon';
import RobotIcon from '../assets/RobotIcon';
import UsersIcon from '../assets/UsersIcon';


const AuraPanel = ({
  user,
  onLogout,
  darkMode,
  setDarkMode,
  panelActivo: panelActivoProp,
  setPanelActivo: setPanelActivoProp,
  notifications,
  setNotifications,
  notificationCount,
  setNotificationCount,
  notificationsEnabled,
  setNotificationsEnabled,
  showSupportModal,
  setShowSupportModal,
  showProfile,
  setShowProfile,
  showNotifications,
  setShowNotifications,
  showSettings,
  setShowSettings,
  showHelpDropdown,
  setShowHelpDropdown,
  settingsPanelRef,
  // ajustesBtnRef,
  helpBtnRef,
  loginError,
  registerError,
  verifyError,
  pendingEmail,
  registerSuccess,
  handleVerifyRecoveryCode,
  handleResetPassword,
  handleVerify,
  onUserUpdate
}) => {
  const [panelActivoState, setPanelActivoState] = React.useState('home');
  const panelActivo = panelActivoProp !== undefined ? panelActivoProp : panelActivoState;
  const setPanelActivo = setPanelActivoProp !== undefined ? setPanelActivoProp : setPanelActivoState;

  // Estado para mostrar el modal de perfil
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  // Estado y ref para mostrar el panel de ajustes como modal
  const [showSettingsPanel, setShowSettingsPanel] = React.useState(false);
  const ajustesBtnRef = React.useRef(null);
  // Los estados locales de panelActivo, showProfile, showNotifications, showSettings ahora vienen por props

  // --- Feature Cards Animation State ---
  const featureItems = [
    {
      icon: '⚡',
      title: 'Automatización Inteligente',
      desc: 'Configura respuestas automáticas, gestiona alertas y deja que Neto atienda las interacciones por ti.'
    },
    {
      icon: '📊',
      title: 'Panel de Tendencias',
      desc: 'Descubre qué temas generan mayor impacto en tus publicaciones y toma decisiones basadas en datos en tiempo real.'
    },
    {
      icon: '🔗',
      title: 'Gestión Multicuenta',
      desc: 'Administra fácilmente todas tus cuentas de Instagram desde un solo panel centralizado.'
    },
    {
      icon: '🔍',
      title: 'Análisis de Datos',
      desc: 'Explora el rendimiento de tu feed: likes, comentarios, reenvíos y mucho más.'
    }
  ];
  const [hovered, setHovered] = React.useState(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const intervalRef = React.useRef();
  React.useEffect(() => {
    if (hovered !== null) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIdx(idx => (idx + 1) % featureItems.length);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [hovered, featureItems.length]);
  const renderPanel = () => {
    switch (panelActivo) {
      case 'home':
        return (
          <div style={{position:'relative', width:'100%', height:'calc(100vh - 120px)', minHeight:600}}>
            {/* Fondo degradado ocupa todo el espacio entre header y borde derecho */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              background: 'linear-gradient(120deg, #18425d 0%, #2196f3 60%, #e3f2fd 100%)',
            }} />
            {/* Contenido encima del fondo */}
            <div style={{position:'relative', zIndex:1, width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{display:'flex', flexDirection:'row', width:'100%', height:'100%'}}>
                {/* Columna izquierda: texto y botones */}
                <div style={{flex:2, display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 32px 32px 48px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:8}}>
                    <span style={{
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      width:48,
                      height:48,
                      background:'#fff',
                      borderRadius:'50%',
                      boxShadow:'0 2px 8px #0001',
                      flexShrink:0
                    }}>
                      <img src={aLogo} alt="A Logo" style={{height:28, width:28, objectFit:'contain'}} />
                    </span>
                    <span style={{fontSize:'2.1rem', fontWeight:800, color:'#fff'}}>👋 Hola {user?.nombre || user?.usuario || 'Usuario'}</span>
                  </div>
                  <div style={{fontSize:'1.4rem', fontWeight:700, color:'#fff', marginBottom:8}}>
                    ¡Bienvenido a tu panel en Aura <span role="img" aria-label="cohete">🚀</span>
                  </div>
                  <div style={{color:'#e3f2fd', fontWeight:500, fontSize:'1.1rem', marginBottom:8}}><em>Nos alegra tenerte aquí.</em></div>
                  <div style={{color:'#fff', fontSize:'1.05rem', marginBottom:18, maxWidth:1100}}>
                    En Aura podrás gestionar y automatizar la interacción de tus cuentas de Instagram, descubrir tendencias clave en vacantes, eventos y reuniones, responder automáticamente a tus clientes con Neto nuestro chatbot y obtener una visión clara de tu impacto digital. Además, podrás programar publicaciones, analizar el crecimiento de tus seguidores, recibir alertas inteligentes y mucho más. Todo desde un solo lugar: simple, ágil y seguro. ¡Empieza a explorar y lleva tu presencia digital al siguiente nivel!
                  </div>
                  <div style={{display:'flex', gap:12, marginBottom:18, flexWrap:'wrap'}}>
                    <button style={{background:'#1ee6d9', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'8px 18px', fontSize:'1rem', cursor:'pointer'}}>Deja que Neto trabaje por ti 🤖</button>
                    <button style={{background:'#1ee6d9', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'8px 18px', fontSize:'1rem', cursor:'pointer'}}>Tendencias claras, decisiones inteligentes 🧠</button>
                    <button style={{background:'#1ee6d9', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'8px 18px', fontSize:'1rem', cursor:'pointer'}}>Un panel, todas tus cuentas 🗝️</button>
                  </div>
                  <div style={{display:'flex', gap:24, marginTop:32, flexWrap:'nowrap', justifyContent:'center'}}>
                    {featureItems.map((item, idx) => {
                      const isActive = (hovered === null && activeIdx === idx) || hovered === idx;
                      return (
                        <div
                          key={item.title}
                          style={{
                            background:'rgba(24,59,84,0.92)',
                            borderRadius:14,
                            padding:'28px 36px',
                            minWidth:280,
                            maxWidth:340,
                            flex:1,
                            color:'#fff',
                            boxShadow: isActive ? '0 12px 36px #0007' : '0 2px 16px #0004',
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center',
                            cursor:'pointer',
                            transition:'transform 0.8s cubic-bezier(.4,2,.6,1), box-shadow 0.8s',
                            transform: isActive ? 'translateY(-18px) scale(1.08)' : '',
                          }}
                          onMouseEnter={() => setHovered(idx)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <span style={{fontSize:'2.5rem', marginBottom:10}}>{item.icon}</span>
                          <div style={{fontSize:'1.35rem', fontWeight:700, marginBottom:10, textAlign:'center'}}>{item.title}</div>
                          <div style={{color:'#b3e5fc', fontWeight:500, textAlign:'center'}}>{item.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:'flex', gap:18, marginTop:32, flexWrap:'wrap', justifyContent:'center'}}>
                    <button 
                      style={{background:'#fff', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'12px 28px', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:8}}
                      onClick={() => setPanelActivo('dashboard')}
                    >
                      <DashboardIcon size={22} color="#2196f3" /> Dashboard
                    </button>
                    <button 
                      style={{background:'#fff', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'12px 28px', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:8}}
                      onClick={() => setPanelActivo('tendencias')}
                    >
                      <TrendsIcon size={22} color="#1ee6d9" /> Tendencias
                    </button>
                    <button 
                      style={{background:'#fff', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'12px 28px', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:8}}
                      onClick={() => setPanelActivo('respuestas')}
                    >
                      ⚙️ Configurar Neto
                    </button>
                    <button 
                      style={{background:'#fff', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'12px 28px', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:8}}
                      onClick={() => setPanelActivo('cuentas')}
                    >
                      ➕ Vincular nueva cuenta
                    </button>
                    <button 
                      style={{background:'#fff', color:'#183b54', fontWeight:700, border:'none', borderRadius:8, padding:'12px 28px', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:8}}
                      onClick={() => setShowNotifications(true)}
                    >
                      🔔 Revisar notificaciones
                    </button>
                  </div>
                  <div style={{marginTop:32, background:'#3376a0ff', borderRadius:12, padding:'16px 0', textAlign:'center', color:'#fff', fontWeight:800, fontSize:'1.2rem', letterSpacing:0.5}}>
                    <span role="img" aria-label="estrella">✨</span> Comienza a personalizar tu experiencia en Aura <span role="img" aria-label="estrella">✨</span>
                  </div>
                </div>
                {/* Columna derecha: robot */}
                <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'flex-start', minHeight:340, position:'relative'}}>
                  <div style={{display:'flex', alignItems:'flex-start', gap:24, marginLeft:'-450px'}}>
                    <AnimatedRobot style={{height:260, width:200, marginBottom:0, alignSelf:'flex-start', marginTop:'-350px', marginLeft:'20px'}} />
                    <div style={{
                      background:'#fff',
                      color:'#232a3b',
                      borderRadius:18,
                      padding:'14px 18px',
                      fontWeight:800,
                      fontSize:'1.05rem',
                      boxShadow:'0 2px 12px #0002',
                      display:'flex',
                      alignItems:'center',
                      gap:10,
                      minWidth:160,
                      maxWidth:220,
                      marginLeft:'-10px',
                      marginTop:'-310px'
                    }}>
                      <span style={{fontSize:'2rem', display:'flex', alignItems:'center'}}>🤖</span>
                      <span style={{display:'flex', flexDirection:'column'}}>
                        Bienvenido,<br/>
                        soy Neto y<br/>
                        será un placer<br/>
                        ayudarte
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return <DashboardPanel />;
      case 'tendencias':
        return <TendenciasPanel />;
      case 'respuestas':
        return <RespuestasPanel setNotifications={setNotifications} setNotificationCount={setNotificationCount} user={user} />;
      case 'prueba-neto':
        return <PruebaNetoPanel />;
      case 'cuentas':
        return <CuentasPanel />;
      case 'ajustes':
        return <SettingsPanel />;
      default:
        return (
          <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', color:'#232a3b', fontWeight:700}}>
            Bienvenido a Aura 👋
          </div>
        );
    }
  };

  // Ref para la campana
  const bellRef = React.useRef(null);
  // Cerrar modal al hacer click fuera
  React.useEffect(() => {
    if (!showNotifications) return;
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifications, setShowNotifications]);

  // Header y nueva barra lateral moderna
  return (
  <div className="aura-panel" style={{display:'flex', minHeight:'100vh', width:'100vw', background:'#fff'}}>
      {/* Header superior */}
      <header className="aura-header" style={{background:'#0a2342', height:'120px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', boxSizing:'border-box', width:'100vw', position:'fixed', top:0, left:0, zIndex:100}}>
        <div className="aura-logo" style={{display:'flex', alignItems:'center', gap:'18px'}}>
          <img src={logoAura} alt="AURA Logo" style={{height:'100px'}} />
          <span
            style={{display:'flex', alignItems:'center', background:'#fff', borderRadius:'50%', padding:4, marginLeft:'18px', cursor:'pointer'}}
            onClick={() => setShowProfileModal(true)}
            title="Ver perfil"
          >
            <ProfileIcon size={32} color="#232a3b" />
          </span>
          <span
            ref={bellRef}
            style={{display:'flex', alignItems:'center', background:'none', marginLeft:'10px', cursor:'pointer', position:'relative'}}
            onClick={() => setShowNotifications(s => !s)}
            title="Ver notificaciones"
          >
            <BellIcon size={32} color="#FFD600" />
            {(notificationsEnabled
              ? Number(notificationCount) > 0
              : true) && (
              <span style={{
                position: 'absolute',
                top: -8,
                left: -8,
                minWidth: 22,
                height: 22,
                background: notificationsEnabled ? '#e53e3e' : '#888',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 14,
                border: '2px solid #fff',
                boxShadow: notificationsEnabled ? '0 2px 8px #e53e3e55' : '0 2px 8px #8885',
                zIndex: 2
              }}>{notificationsEnabled ? notificationCount : '✕'}</span>
            )}
            <BellDropdownModal
              open={!!showNotifications}
              anchorRef={bellRef}
              notifications={notifications}
              setNotifications={setNotifications}
              setNotificationCount={setNotificationCount}
              onClose={() => setShowNotifications(false)}
            />
          </span>
        </div>
        <div className="aura-header-actions" style={{display:'flex', alignItems:'center', gap:'32px'}}>
          {/* Botón de ayuda con modal */}
          <span
            ref={helpBtnRef}
            style={{display:'flex', alignItems:'center', background:'#fff', borderRadius:'50%', padding:4, marginRight:'18px', cursor:'pointer'}}
            onClick={() => setShowHelpDropdown && setShowHelpDropdown(true)}
            title="Ayuda y soporte"
          >
            <HelpIcon size={28} color="#188fd9" />
          </span>
          {showHelpDropdown && setShowHelpDropdown && (
            <HelpDropdownModal open={showHelpDropdown} anchorRef={helpBtnRef} onClose={() => setShowHelpDropdown(false)} />
          )}
          <button
            className="aura-logout-btn"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Nueva barra lateral moderna */}
      <aside className="aura-sidebar" style={{background:'#0a2342', minWidth:'250px', width:'305px', display:'flex', flexDirection:'column', alignItems:'flex-start', padding:'0 0 0 0', paddingTop:'32px', position:'fixed', top:'120px', left:0, height:'calc(100vh - 120px)', boxShadow:'0 2px 12px #0002', zIndex:99}}>
        {/* Logo grande arriba */}
        <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'18px'}}>
          {/* Logo eliminado */}
        </div>
        {/* Menú de navegación */}
        <nav style={{width:'100%'}}>
          <ul style={{listStyle:'none', padding:0, margin:0, width:'100%'}}>
            <li onClick={() => setPanelActivo('home')} style={{
              display:'flex', alignItems:'center', gap:'14px', padding:'14px 28px', cursor:'pointer', fontWeight:700,
              color:panelActivo==='home'?'#fff':'#fff',
              fontSize:'1.05rem',
              background:panelActivo==='home'?'linear-gradient(90deg, #183b54 80%, #1ee6d9 100%)':'none',
              borderLeft:panelActivo==='home'?'4px solid #1EE6D9':'4px solid transparent',
              boxShadow: panelActivo==='home' ? '0 2px 8px #1ee6d955' : 'none',
              transition:'all 0.2s'
            }}>
              <HomeIcon size={20} color={panelActivo==='home'?'#fff':'#fff'} /> Inicio
            </li>
            <li onClick={() => setPanelActivo('dashboard')} style={{
              display:'flex', alignItems:'center', gap:'14px', padding:'14px 28px', cursor:'pointer', fontWeight:700,
              color:panelActivo==='dashboard'?'#fff':'#fff',
              fontSize:'1.05rem',
              background:panelActivo==='dashboard'?'linear-gradient(90deg, #183b54 80%, #1ee6d9 100%)':'none',
              borderLeft:panelActivo==='dashboard'?'4px solid #1EE6D9':'4px solid transparent',
              boxShadow: panelActivo==='dashboard' ? '0 2px 8px #1ee6d955' : 'none',
              transition:'all 0.2s'
            }}>
              <DashboardIcon size={20} color={panelActivo==='dashboard'?'#fff':'#fff'} /> Dashboard
            </li>
            <li onClick={() => setPanelActivo('tendencias')} style={{
              display:'flex', alignItems:'center', gap:'14px', padding:'14px 28px', cursor:'pointer', fontWeight:700,
              color:panelActivo==='tendencias'?'#fff':'#fff',
              fontSize:'1.05rem',
              background:panelActivo==='tendencias'?'linear-gradient(90deg, #183b54 80%, #1ee6d9 100%)':'none',
              borderLeft:panelActivo==='tendencias'?'4px solid #1EE6D9':'4px solid transparent',
              boxShadow: panelActivo==='tendencias' ? '0 2px 8px #1ee6d955' : 'none',
              transition:'all 0.2s'
            }}>
              <TrendsIcon size={20} color={panelActivo==='tendencias'?'#fff':'#fff'} /> Análisis de Tendencias
            </li>
            <li onClick={() => setPanelActivo('respuestas')} style={{
              display:'flex', alignItems:'center', gap:'14px', padding:'14px 28px', cursor:'pointer', fontWeight:700,
              color:panelActivo==='respuestas'?'#fff':'#fff',
              fontSize:'1.05rem',
              background:panelActivo==='respuestas'?'linear-gradient(90deg, #183b54 80%, #1ee6d9 100%)':'none',
              borderLeft:panelActivo==='respuestas'?'4px solid #1EE6D9':'4px solid transparent',
              boxShadow: panelActivo==='respuestas' ? '0 2px 8px #1ee6d955' : 'none',
              transition:'all 0.2s'
            }}>
              <ChatIcon size={20} color={panelActivo==='respuestas'?'#fff':'#fff'} /> Respuestas Automáticas
            </li>
            <li onClick={() => setPanelActivo('prueba-neto')} style={{
              display:'flex', alignItems:'center', gap:'14px', padding:'14px 28px', cursor:'pointer', fontWeight:700,
              color:panelActivo==='prueba-neto'?'#fff':'#fff',
              fontSize:'1.05rem',
              background:panelActivo==='prueba-neto'?'linear-gradient(90deg, #183b54 80%, #1ee6d9 100%)':'none',
              borderLeft:panelActivo==='prueba-neto'?'4px solid #1EE6D9':'4px solid transparent',
              boxShadow: panelActivo==='prueba-neto' ? '0 2px 8px #1ee6d955' : 'none',
              transition:'all 0.2s'
            }}>
              <RobotIcon size={20} color={panelActivo==='prueba-neto'?'#fff':'#fff'} /> Prueba Neto
            </li>
            <li onClick={() => setPanelActivo('cuentas')} style={{
              display:'flex', alignItems:'center', gap:'14px', padding:'14px 28px', cursor:'pointer', fontWeight:700,
              color:panelActivo==='cuentas'?'#fff':'#fff',
              fontSize:'1.05rem',
              background:panelActivo==='cuentas'?'linear-gradient(90deg, #183b54 80%, #1ee6d9 100%)':'none',
              borderLeft:panelActivo==='cuentas'?'4px solid #1EE6D9':'4px solid transparent',
              boxShadow: panelActivo==='cuentas' ? '0 2px 8px #1ee6d955' : 'none',
              transition:'all 0.2s'
            }}>
              <UsersIcon size={20} color={panelActivo==='cuentas'?'#fff':'#fff'} /> Cuentas
            </li>
          </ul>
        </nav>
        {/* Botón Ajustes abajo */}
        <div style={{marginTop:'auto', width:'100%', display:'flex', justifyContent:'center', alignItems:'center', padding:'32px 0'}}>
          <button
            ref={ajustesBtnRef}
            style={{width:'90%', background:'linear-gradient(90deg, #1EE6D9 60%, #188fd9 100%)', color:'#fff', fontWeight:700, border:'none', borderRadius:'12px', padding:'9px 0', fontSize:'1.08rem', cursor:'pointer', boxShadow:'0 2px 8px rgba(30,230,217,0.13)', transition:'background 0.2s', marginBottom:'40px'}}
            onClick={() => setShowSettingsPanel(true)}
          >Ajustes</button>
        </div>
      </aside>

      {/* Main content area: render selected panel */}
  <main style={{marginLeft: '305px', marginTop: '120px', flex: 1, background: '#fff', minHeight: 'calc(100vh - 120px)'}}>
        {renderPanel()}
        <SettingsPanel
          visible={showSettingsPanel}
          anchorRef={ajustesBtnRef}
          onClose={() => setShowSettingsPanel(false)}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onSupport={showSupportModal ? undefined : setShowSupportModal}
        />
      </main>
      {/* Modal de perfil */}
  <ProfileModalWrapper show={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} onUserUpdate={onUserUpdate} />

  {/* Modal de notificaciones ligado a la campana (BellDropdownModal) */}
    </div>
  );
};

export default AuraPanel;
