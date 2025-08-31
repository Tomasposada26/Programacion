import React, { useState, useEffect } from 'react';
import PasswordResetModal from './PasswordResetModal';
import PasswordRecoveryModal from './PasswordRecoveryModal';
import AnimatedRobot from './assets/AnimatedRobot';
import Modal from 'react-modal';
import NotificationsModal from './NotificationsModal';
import ProfileModal from './ProfileModal';
import DashboardPanel from './DashboardPanel';
import TendenciasPanel from './TendenciasPanel';
import RespuestasPanel from './RespuestasPanel';
import DatosPanel from './DatosPanel';
import PruebaNetoPanel from './PruebaNetoPanel';
import CuentasPanel from './CuentasPanel';
import logo from './assets/logo-aura.png';
import './background.css';
import './App.css';
import './global-overflow-fix.css';
import { FaHome, FaChartBar, FaChartLine, FaComments, FaUserPlus, FaRobot, FaBolt, FaChartPie, FaLink, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserActionsBar from './UserActionsBar';
import RegisterModal from './RegisterModal';
import VerifyModal from './VerifyModal';
import LoginModal from './LoginModal';
import EmailVerifyModal from './EmailVerifyModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsPanel from './SettingsPanel';
import './i18n';
import HelpIcon from './assets/HelpIcon';
import { useTranslation } from 'react-i18next';

// URL del backend desde variable de entorno
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function App() {
  // Estados para recuperación de contraseña
  // ...dejar solo una declaración de showRecovery, setShowRecovery dentro de App...
  const [recoveryStep, setRecoveryStep] = useState('email'); // 'email', 'code', 'newpass'
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Handler para enviar correo de recuperación
  const handleSendRecovery = async (email) => {
    setRecoveryError('');
    setRecoveryEmail(email);
    try {
      const res = await fetch(`${BACKEND_URL}/api/recovery/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRecoveryError(errorData.error || 'No se pudo enviar el correo');
        return;
      }
      setShowRecovery(false);
      setShowResetModal(true);
      setRecoveryStep('code');
    } catch (err) {
      setRecoveryError('Error al enviar el correo de recuperación');
    }
  };

  // Handler para verificar código
  const handleVerifyRecoveryCode = async (code) => {
    setRecoveryError('');
    setRecoveryCode(code);
    try {
      const res = await fetch(`${BACKEND_URL}/api/recovery/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: recoveryEmail, codigo: code })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRecoveryError(errorData.error || 'Código inválido');
        return;
      }
      setRecoveryStep('newpass');
    } catch (err) {
      setRecoveryError('Código inválido o expirado');
    }
  };

  // Handler para cambiar la contraseña
  const handleResetPassword = async (password, repeat) => {
    setRecoveryError('');
    if (password !== repeat) {
      setRecoveryError('Las contraseñas no coinciden');
      return;
    }
    const isPasswordSecure = pw =>
      pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
    if (!isPasswordSecure(password)) {
      setRecoveryError('La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo.');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/recovery/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: recoveryEmail, codigo: recoveryCode, password, repeat })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRecoveryError(errorData.error || 'No se pudo cambiar la contraseña');
        return;
      }
      setShowResetModal(false);
      setRecoveryStep('email');
      setRecoveryCode('');
      setRecoveryEmail('');
      alert('¡Contraseña restablecida! Ahora puedes iniciar sesión.');
    } catch (err) {
      setRecoveryError('Error al cambiar la contraseña');
    }
  };
  // Estado para mostrar el modal de soporte
  const [showSupportModal, setShowSupportModal] = useState(false);
  // Estado para el panel de ajustes
  const [showSettings, setShowSettings] = useState(false);
  // Referencia para el panel de ajustes
  const settingsPanelRef = React.useRef(null);
  // Referencia para el botón de ajustes
  const ajustesBtnRef = React.useRef(null);
  // Cerrar el panel de ajustes al hacer clic fuera
  useEffect(() => {
    if (!showSettings) return;
    function handleClickOutside(e) {
      if (
        ajustesBtnRef.current &&
        !ajustesBtnRef.current.contains(e.target) &&
        settingsPanelRef.current &&
        !settingsPanelRef.current.contains(e.target)
      ) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);
  // Estado para mostrar el dropdown de ayuda
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const helpBtnRef = React.useRef();
  // Cerrar el dropdown de ayuda al hacer clic fuera
  useEffect(() => {
    if (!showHelpDropdown) return;
    function handleClickOutside(e) {
      if (helpBtnRef.current && !helpBtnRef.current.contains(e.target)) {
        setShowHelpDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHelpDropdown]);
  // Estado global de modo oscuro
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation();
  const [, setLangRerender] = useState(0);

  // Estado para modal de perfil
  const [showProfile, setShowProfile] = useState(false);

  // Estado para usuario real
  const [user, setUser] = useState(null);

  // Estado para modal de notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  // Estado para activar/desactivar notificaciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // Estado para el contador y lista de notificaciones
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Exponer notificaciones globales para otros componentes (como RespuestasPanel)
  React.useEffect(() => {
    window.setNotifications = setNotifications;
    window.setNotificationCount = setNotificationCount;
    window.notifications = notifications;
    window.notificationCount = notificationCount;
    return () => {
      delete window.setNotifications;
      delete window.setNotificationCount;
      delete window.notifications;
      delete window.notificationCount;
    };
  }, [notifications, notificationCount]);

  // Estados principales
  const [sesionIniciada, setSesionIniciada] = useState(false);

  // Controlar scroll según login
  useEffect(() => {
    if (sesionIniciada) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [sesionIniciada]);

  // Efecto para modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('aura-dark');
    } else {
      document.body.classList.remove('aura-dark');
    }
  }, [darkMode]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);

  // Estados para errores y datos temporales
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Handler para verificar código de verificación (debe estar dentro de App)
  const handleVerify = async (code) => {
    setVerifyError('');
    try {
  const res = await fetch(`${BACKEND_URL}/api/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: pendingEmail, codigo: code })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setVerifyError(errorData.error || 'Código incorrecto');
        toast.error(errorData.error || 'Código incorrecto');
        return;
      }
      setShowVerify(false);
      setRegisterSuccess(true);
      toast.success('¡Cuenta verificada! Ya puedes iniciar sesión.');
    } catch (err) {
      setVerifyError('Error al verificar la cuenta');
      toast.error('Error al verificar la cuenta');
    }
  };

  // Reenviar código de verificación
  // Reenviar código de verificación
  React.useEffect(() => {
    const handler = async (e) => {
      const correo = e.detail;
      try {
  const res = await fetch(`${BACKEND_URL}/api/reenviar-verificacion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo })
        });
        if (!res.ok) {
          const errorData = await res.json();
          toast.error(errorData.error || 'No se pudo reenviar el código');
        } else {
          toast.success('¡Nuevo código enviado! Revisa tu correo.');
        }
      } catch (err) {
        toast.error('Error al reenviar el código');
      }
    };
    window.addEventListener('reenviar-codigo-verificacion', handler);
    return () => window.removeEventListener('reenviar-codigo-verificacion', handler);
  }, []);


  // Handler de login
  const handleLogin = async (form) => {
    setLoginError('');
    try {
  const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: form.usuario, contrasena: form.contrasena })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Cuenta no verificada') {
          setPendingEmail(form.usuario);
          setShowLogin(false);
          setShowEmailVerify(true); // Solo abre el modal para pedir el correo
          // NO enviar correo ni mostrar toast aquí
        } else {
          setLoginError(data.error || 'Error al iniciar sesión');
          toast.error(data.error || 'Error al iniciar sesión');
        }
        return;
      }
      // Obtener datos reales del usuario tras login exitoso
      // data.usuario puede ser username o correo, según backend
  const resUser = await fetch(`${BACKEND_URL}/api/usuario/info?usuario=${encodeURIComponent(data.usuario)}`);
      let userData = await resUser.json();
      setUser(userData);
      // Esperar un poco y volver a pedir los datos para asegurar que ultima_conexion esté actualizada
      setTimeout(async () => {
  const resUser2 = await fetch(`${BACKEND_URL}/api/usuario/info?usuario=${encodeURIComponent(data.usuario)}`);
        const userData2 = await resUser2.json();
        setUser(userData2);
      }, 500);
      setSesionIniciada(true);
      setPanelActivo('inicio');
      setShowLogin(false);
      toast.success('¡Sesión iniciada correctamente!');
    } catch (err) {
      setLoginError('Error de conexión con el servidor');
      toast.error('Error al iniciar sesión.');
    }
  };

  // Handler de registro
  const handleRegister = async (data) => {
    setRegisterError('');
    try {
  const res = await fetch(`${BACKEND_URL}/api/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          apellidos: data.apellidos,
          usuario: data.usuario,
          correo: data.correo,
          contrasena: data.contrasena
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRegisterError(errorData.error || 'Error en el registro');
        toast.error(errorData.error || 'Error en el registro');
        return;
      }
      setPendingEmail(data.correo);
      setShowRegister(false);
      setShowVerify(true);
      toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
    } catch (err) {
      setRegisterError('Error de conexión con el servidor');
      toast.error('Error de conexión con el servidor');
    }
  };

  // Logout
  const handleLogout = () => {
    setSesionIniciada(false);
    toast.info('Sesión finalizada.');
  };

  // Estado para el panel activo
  const [panelActivo, setPanelActivo] = useState('inicio');


  // Renderizado condicional de paneles
  const renderPanel = () => {
    switch(panelActivo) {
      case 'dashboard': return <DashboardPanel />;
      case 'tendencias': return <TendenciasPanel />;
      case 'respuestas': return <RespuestasPanel />;
      case 'datos': return <DatosPanel />;
      case 'prueba': return <PruebaNetoPanel />;
      case 'cuentas': return <CuentasPanel />;
      default: return (
        <div className="aura-main-panel-bg" style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '100%',
          background: 'none',
          padding: 0,
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: '100%',
              margin: 0,
              background: `linear-gradient(120deg, ${document.body.classList.contains('aura-dark') ? '#232a3b 0%, #188fd9 60%, #10b981 100%' : '#188fd9 0%, #10b981 60%, #b97adf 100%'})`,
              borderRadius: 0,
              boxShadow: '0 8px 32px rgba(30,230,217,0.10), 0 1.5px 8px rgba(36,198,240,0.10)',
              padding: '48px 40px 40px 40px',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '100%',
              minWidth: 0
            }}
          >
            <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:10}}>
              <img src={user?.avatar || '/logo192.png'} alt="avatar" style={{width:48,height:48,borderRadius:'50%',objectFit:'cover',border:'2.5px solid #fff',boxShadow:'0 2px 8px rgba(0,0,0,0.10)'}} />
              <span style={{fontSize:'2.1rem',fontWeight:800,letterSpacing:0.5,display:'flex',alignItems:'center',gap:8}}>
                <span role="img" aria-label="wave">👋</span> {t('welcome.hello', { name: user?.nombre || user?.name || '' })}
              </span>
            </div>
            <h1 style={{fontSize:'1.7rem',fontWeight:700,marginBottom:8,letterSpacing:0.5}}>
              {t('welcome.title')}
              <span role="img" aria-label="rocket"> 🚀</span>
            </h1>
            <div style={{fontStyle:'italic',fontSize:'1.15rem',color:'#e0e6f0',marginBottom:8}}>{t('welcome.subtitle')}</div>
            <div style={{fontSize:'1.13rem',fontWeight:500,maxWidth:1100,marginBottom:18,lineHeight:1.5}}>{t('welcome.description')}</div>
            {/* Frases cortas y humanas */}
            <div style={{display:'flex',gap:18,marginBottom:18,flexWrap:'wrap'}}>
              <span style={{background:'#fff2',color:'#232a3b',borderRadius:12,padding:'6px 16px',fontWeight:600,fontSize:'1.08rem',boxShadow:'0 1px 4px #0001'}}>{t('welcome.shortPhrase1')}</span>
              <span style={{background:'#fff2',color:'#232a3b',borderRadius:12,padding:'6px 16px',fontWeight:600,fontSize:'1.08rem',boxShadow:'0 1px 4px #0001'}}>{t('welcome.shortPhrase2')}</span>
              <span style={{background:'#fff2',color:'#232a3b',borderRadius:12,padding:'6px 16px',fontWeight:600,fontSize:'1.08rem',boxShadow:'0 1px 4px #0001'}}>{t('welcome.shortPhrase3')}</span>
            </div>
            {/* Banner de 4 cuadros (prioridad visual) */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:24,marginBottom:24,position:'relative'}}>
              {/* Avatar tipo robot animado en el espacio muerto */}
              <div
                style={{
                  position: 'absolute',
                  top: '-235px',
                  right: '265px',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{position:'relative',width:'fit-content',height:'fit-content'}}>
                  <AnimatedRobot />
                  <motion.div
                    initial={{ opacity: 0, x: 30, scale: 0.8 }}
                    animate={{ opacity: 1, x: -20, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, type: 'spring' }}
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '100%',
                      minWidth: 160,
                      maxWidth: 220,
                      background: 'linear-gradient(90deg,#fff 60%,#e0f7fa 100%)',
                      color: '#232a3b',
                      fontWeight: 600,
                      fontSize: '1.08rem',
                      borderRadius: '18px',
                      boxShadow: '0 2px 12px #10b98122',
                      padding: '12px 14px 12px 12px',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      border: '2px solid #10b981',
                    }}
                  >
                    <span style={{fontSize:'1.3rem',marginRight:6}}>🤖</span>
                    {t('welcome.robotMessage')}
                  </motion.div>
                </div>
              </div>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, times: [0, 0.5, 1], delay: 0, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
                style={{background:'linear-gradient(135deg,#3b82f6 0%,#06b6d4 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(59,130,246,0.10)'}}>
                <div style={{fontSize:'2rem',marginBottom:6}}><FaBolt /></div>
                <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.smartAutomation')}</h3>
                <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.smartAutomationDesc')}</p>
              </motion.div>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, times: [0, 0.5, 1], delay: 3, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
                style={{background:'linear-gradient(135deg,#06b6d4 0%,#a78bfa 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(6,182,212,0.10)'}}>
                <div style={{fontSize:'2rem',marginBottom:6}}><FaChartPie /></div>
                <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.trendsPanel')}</h3>
                <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.trendsPanelDesc')}</p>
              </motion.div>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, times: [0, 0.5, 1], delay: 6, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
                style={{background:'linear-gradient(135deg,#a78bfa 0%,#06b6d4 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(167,139,250,0.10)'}}>
                <div style={{fontSize:'2rem',marginBottom:6}}><FaLink /></div>
                <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.multiAccount')}</h3>
                <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.multiAccountDesc')}</p>
              </motion.div>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, times: [0, 0.5, 1], delay: 9, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
                style={{background:'linear-gradient(135deg,#10b981 0%,#3b82f6 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(16,185,129,0.10)'}}>
                <div style={{fontSize:'2rem',marginBottom:6}}><FaSearch /></div>
                <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.dataAnalysis')}</h3>
                <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.dataAnalysisDesc')}</p>
              </motion.div>
            </div>
            {/* Botones de acción rápidos centrados debajo del banner de 4 cuadros */}
            <div style={{display:'flex',justifyContent:'center',gap:24,marginBottom:32,flexWrap:'wrap'}}>
              <button onClick={()=>setPanelActivo('cuentas')} style={{display:'flex',alignItems:'center',gap:8,background:'#fff',color:'#232a3b',border:'2.5px solid #10b981',borderRadius:16,padding:'12px 24px',fontWeight:700,fontSize:'1.09rem',boxShadow:'0 2px 8px #10b98122',cursor:'pointer',transition:'box-shadow .2s,border .2s'}}>
                <span style={{fontSize:'1.35rem',color:'#7c3aed'}}>➕</span> {t('welcome.quickLinkAccount')}
              </button>
              <button onClick={()=>setPanelActivo('respuestas')} style={{display:'flex',alignItems:'center',gap:8,background:'#fff',color:'#232a3b',border:'2.5px solid #188fd9',borderRadius:16,padding:'12px 24px',fontWeight:700,fontSize:'1.09rem',boxShadow:'0 2px 8px #188fd922',cursor:'pointer',transition:'box-shadow .2s,border .2s'}}>
                <span style={{fontSize:'1.35rem',color:'#818cf8'}}>⚙️</span> {t('welcome.quickLinkNeto')}
              </button>
              <button onClick={()=>setShowNotifications(true)} style={{display:'flex',alignItems:'center',gap:8,background:'#fff',color:'#232a3b',border:'2.5px solid #ffe03c',borderRadius:16,padding:'12px 24px',fontWeight:700,fontSize:'1.09rem',boxShadow:'0 2px 8px #ffe03c22',cursor:'pointer',transition:'box-shadow .2s,border .2s'}}>
                <span style={{fontSize:'1.35rem',color:'#fbbf24'}}>📨</span> {t('welcome.quickLinkNotifications')}
              </button>
            </div>
            <div style={{background:'linear-gradient(90deg,#10b981 0%,#188fd9 100%)',color:'#fff',fontWeight:800,fontSize:'1.18rem',borderRadius:12,padding:'16px 44px',boxShadow:'0 4px 16px rgba(16,185,129,0.13)',letterSpacing:'1px',marginTop:8,textAlign:'center'}}>
              <span role="img" aria-label="sparkles">✨</span> {t('welcome.cta')}
            </div>
            <img src="/logo192.png" alt="Aura logo" style={{position:'absolute',right:40,top:40,width:70,opacity:0.13}} />
          </motion.div>
        </div>
      );
    }
  };

  return (
    <>
      <header className="aura-header">
        <div className="aura-header-content" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100vw',paddingRight:32}}>
          <div style={{display:'flex',alignItems:'center',gap:18}}>
            <img src={logo} alt="Logo Aura" className="aura-logo" style={{marginLeft: 0, marginRight: 0}} />
            {sesionIniciada && (
              <div style={{display:'flex',alignItems:'center',gap:18,marginLeft:10}}>
                <button style={{background:'none',border:'none',padding:0,cursor:'pointer',borderRadius:'50%',width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',transition:'background 0.2s'}} aria-label="Perfil" onClick={()=>setShowProfile(true)}>
                  <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="var(--aura-profile-bg, #fff)"/>
                    <path d="M16 16c2.5 0 4.5-2 4.5-4.5S18.5 7 16 7s-4.5 2-4.5 4.5S13.5 16 16 16zm0 2c-3 0-9 1.5-9 4.5V26h18v-3.5c0-3-6-4.5-9-4.5z" fill="var(--aura-profile-fg, #1a3365)"/>
                  </svg>
                </button>
  <ProfileModal open={showProfile} onClose={()=>setShowProfile(false)} user={user || {}} />
                <div style={{position:'relative',display:'inline-block'}}>
                  <button
                    style={{background:'none',border:'none',padding:0,cursor:'pointer',borderRadius:'50%',width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',transition:'background 0.2s'}}
                    aria-label="Notificaciones"
                    onClick={() => notificationsEnabled && setShowNotifications(true)}
                  >
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'transparent',
                      position: 'relative'
                    }}>
                      {/* Campanita rellena amarilla SIEMPRE */}
                      <svg width="32" height="32" viewBox="0 0 32 32" style={{display:'block'}}>
                        <circle cx="16" cy="16" r="16" fill="transparent"/>
                        <path d="M16 28c1.7 0 3-1.3 3-3h-6c0 1.7 1.3 3 3 3zm7-7v-6c0-4.1-2.1-7.4-6-8.3V6a2 2 0 1 0-4 0v0.7C9.1 8.6 7 11.9 7 16v6l-2 2v1c0 0.6 0.4 1 1 1h22c0.6 0 1-0.4 1-1v-1l-2-2z" fill="#FFD600" stroke="#bfa000" strokeWidth="1.2"/>
                      </svg>
                      {/* X gris si está desactivado */}
                      {!notificationsEnabled && (
                        <svg width="16" height="16" style={{position:'absolute',top:2,right:2}} viewBox="0 0 16 16">
                          <circle cx="8" cy="8" r="8" fill="var(--aura-notif-x-bg, #fff)"/>
                          <path d="M5 5l6 6M11 5l-6 6" stroke="var(--aura-notif-x-fg, #888)" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                      {/* Contador si está activado */}
                      {notificationsEnabled && (
                        <span style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: notificationCount > 0 ? 'var(--aura-notif-badge-bg, #e53e3e)' : 'var(--aura-notif-badge-bg-empty, #fff)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          color: notificationCount > 0 ? 'var(--aura-notif-badge-fg, #fff)' : 'var(--aura-notif-badge-fg-empty, #888)',
                          border: '2px solid var(--aura-notif-badge-border, #fff)',
                          boxShadow: notificationCount > 0 ? '0 0 4px var(--aura-notif-badge-shadow, #e53e3e55)' : 'none',
                          zIndex: 2
                        }}>
                          {notificationCount}
                        </span>
                      )}
                    </span>
                  </button>
                  <NotificationsModal open={showNotifications} onClose={() => setShowNotifications(false)} notifications={notifications} setNotifications={setNotifications} setNotificationCount={setNotificationCount} />
                </div>
              </div>
            )}
            {!sesionIniciada ? (
              <nav className="aura-navbar aura-navbar-centered">
                <ul className="aura-menu">
                  <li className="aura-menu-item aura-menu-product">
                    <span style={{fontWeight:700, fontSize:'1.18rem', display:'flex', alignItems:'center', gap:7}}>
                      Nuestro producto
                      <svg width="22" height="22" viewBox="0 0 24 24" style={{marginLeft:2,marginBottom:-2}} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                    <div className="aura-dropdown-panel aura-dropdown-soluciones">
                      <div className="aura-dropdown-col">
                        <b style={{color:'var(--aura-soluciones, #188fd9)'}}>NUESTRO PRODUCTO</b>
                        <div className="aura-dropdown-list">
                          <div>
                            <div className="aura-dropdown-title">Vinculación de cuentas Instagram</div>
                            <div className="aura-dropdown-desc">Conecta y administra varias cuentas de Instagram desde un solo panel centralizado.</div>
                          </div>
                          <div>
                            <div className="aura-dropdown-title">Escucha y análisis de interacciones</div>
                            <div className="aura-dropdown-desc">Monitorea y analiza mensajes, comentarios y reacciones para detectar tendencias y oportunidades.</div>
                          </div>
                          <div>
                            <div className="aura-dropdown-title">Chatbot IA Neto</div>
                            <div className="aura-dropdown-desc">Automatiza respuestas y convierte seguidores en leads con inteligencia artificial personalizada.</div>
                          </div>
                          <div>
                            <div className="aura-dropdown-title">Panel de análisis y tendencias</div>
                            <div className="aura-dropdown-desc">Visualiza métricas clave y el crecimiento de tu comunidad en tiempo real.</div>
                          </div>
                        </div>
                      </div>
                      <div className="aura-dropdown-col">
                        <div className="aura-dropdown-list">
                          <div>
                            <div className="aura-dropdown-title">Respuestas automáticas configurables</div>
                            <div className="aura-dropdown-desc">Configura reglas para responder automáticamente a mensajes y comentarios según tus necesidades.</div>
                          </div>
                          <div>
                            <div className="aura-dropdown-title">Simulación de conversaciones</div>
                            <div className="aura-dropdown-desc">Prueba y entrena tu chatbot con escenarios reales antes de lanzarlo a producción.</div>
                          </div>
                          <div>
                            <div className="aura-dropdown-title">Análisis de feed y rendimiento</div>
                            <div className="aura-dropdown-desc">Evalúa el desempeño de tus publicaciones y optimiza tu estrategia de contenido.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="aura-menu-item aura-menu-recursos">
                    <span style={{fontWeight:700, fontSize:'1.18rem', display:'flex', alignItems:'center', gap:7}}>
                      Recursos
                      <svg width="22" height="22" viewBox="0 0 24 24" style={{marginLeft:2,marginBottom:-2}} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                    <div className="aura-dropdown-panel aura-dropdown-aprende">
                      <div className="aura-dropdown-col">
                        <b style={{color:'#188fd9'}}>RECURSOS</b>
                        <div className="aura-dropdown-list">
                          <div><div className="aura-dropdown-title">Panel de análisis y métricas</div><div className="aura-dropdown-desc">Visualiza estadísticas clave y el rendimiento de tus cuentas de Instagram en tiempo real.</div></div>
                          <div><div className="aura-dropdown-title">Simulación de interacciones</div><div className="aura-dropdown-desc">Prueba y entrena tu chatbot simulando conversaciones reales antes de lanzarlo.</div></div>
                          <div><div className="aura-dropdown-title">Preguntas frecuentes</div><div className="aura-dropdown-desc">Encuentra respuestas rápidas a las dudas más comunes sobre el uso de Aura.</div></div>
                          <div><div className="aura-dropdown-title">Soporte y contacto</div><div className="aura-dropdown-desc">Accede a nuestro equipo de soporte para resolver cualquier inconveniente o consulta.</div></div>
                        </div>
                      </div>
                      <div className="aura-dropdown-col">
                        <b style={{color:'#188fd9'}}>CONECTA</b>
                        <div className="aura-dropdown-list">
                          <div><div className="aura-dropdown-title">Comunidad</div><div className="aura-dropdown-desc">Recibe novedades y actualizaciones sobre Aura y el sector.</div></div>
                          <div><div className="aura-dropdown-title">Documentación</div><div className="aura-dropdown-desc">Explora nuestra documentación para crear integraciones.</div></div>
                          <div><div className="aura-dropdown-title">Contáctanos</div><div className="aura-dropdown-desc">Escríbenos a <a href="mailto:hola@aura.com">hola@aura.com</a></div></div>
                          <div className="aura-dropdown-novedades" style={{background:'#f7fafd',borderRadius:10,padding:'12px 16px',marginTop:18}}>
                            <div style={{fontWeight:700}}>¿Qué hay de nuevo?</div>
                            <div style={{fontWeight:400}}>Mantente al día con las últimas novedades y lanzamientos de Aura.</div>
                            <button
                              onClick={() => {
                                const btn = document.getElementById('newsletter-suscribirse-btn');
                                if (btn) {
                                  btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  btn.focus();
                                }
                              }}
                              style={{color:'#e53935',fontWeight:600, background:'none', border:'none', padding:0, cursor:'pointer', textDecoration:'underline'}}
                            >Ver más</button>

                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="aura-menu-item aura-menu-join">
                    <span style={{fontWeight:700, fontSize:'1.18rem', display:'flex', alignItems:'center', gap:7}}>
                      Conócenos
                      <svg width="22" height="22" viewBox="0 0 24 24" style={{marginLeft:2,marginBottom:-2}} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                    <div className="aura-dropdown-panel aura-dropdown-conocenos">
                      <div className="aura-dropdown-list">
                        <div>
                        <div className="aura-dropdown-title">Empleos</div>
                        <div className="aura-dropdown-desc">Descubre oportunidades para unirte al equipo de Aura y contribuir al futuro de la automatización inteligente.</div>
                      </div>
                      <div>
                        <div className="aura-dropdown-title">Sobre nosotros</div>
                        <div className="aura-dropdown-desc">Aura es una plataforma innovadora que integra IA y automatización para potenciar la gestión de redes sociales y la interacción con clientes.</div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
            ) : (
              <UserActionsBar
                onProfile={() => {/* lógica para abrir perfil */}}
                onSettings={() => {/* lógica para abrir ajustes */}}
                onNotifications={() => {/* lógica para abrir notificaciones */}}
              />
            )}
          </div>
          <div className="aura-header-actions">
            {!sesionIniciada ? (
              <>
                <button
                  className="aura-login-btn"
                  onClick={() => setShowLogin(true)}
                  style={{
                    fontSize: '0.98rem',
                    padding: '9px 18px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    minWidth: '110px',
                    marginRight: '10px',
                  }}
                >
                  Iniciar sesión
                </button>
                <div
                  className="aura-register-block"
                  style={{ display: 'flex', alignItems: 'center', fontSize: '0.93rem', gap: 4 }}
                >
                  <span style={{ fontSize: '0.93rem' }}>¿Aún no tienes cuenta?</span>
                  <button
                    className="aura-register-link"
                    onClick={() => setShowRegister(true)}
                    style={{
                      color: '#188fd9',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '0.98rem',
                      marginLeft: 2,
                    }}
                  >
                    Regístrate ahora
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{position:'relative',display:'inline-block'}} ref={helpBtnRef}>
                    <button
                      style={{
                        background: darkMode ? '#188fd9' : '#fff',
                        border: darkMode ? '2px solid #188fd9' : '2px solid #188fd9',
                        padding: 0,
                        cursor: 'pointer',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: darkMode ? '0 2px 8px #188fd955' : '0 2px 8px #188fd922',
                        transition: 'background 0.2s, box-shadow 0.2s',
                      }}
                      aria-label={t('help.title')}
                      onClick={() => setShowHelpDropdown(v => !v)}
                    >
                      <HelpIcon size={28} color={darkMode ? '#fff' : '#188fd9'} />
                    </button>
                    {showHelpDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        minWidth: 240,
                        background: darkMode ? '#232a3b' : '#fff',
                        borderRadius: 16,
                        boxShadow: '0 4px 24px #0003',
                        padding: '18px 16px',
                        zIndex: 1000,
                        border: darkMode ? '1.5px solid #2dd4bf' : '1.5px solid #10b981',
                        display: 'flex', flexDirection: 'column', gap: 14
                      }}>
                        <button style={{background:'#10b981',color:'#fff',border:'none',borderRadius:12,padding:'12px 0',fontWeight:700,fontSize:'1.07rem',cursor:'pointer',boxShadow:'0 1px 6px #10b98122'}}
                          onClick={() => { setShowSupportModal(true); setShowHelpDropdown(false); }}
                        >
                          {t('help.contactSupport','Contactar a soporte')}
                        </button>
                        <button style={{background:'#188fd9',color:'#fff',border:'none',borderRadius:12,padding:'12px 0',fontWeight:700,fontSize:'1.07rem',cursor:'pointer',boxShadow:'0 1px 6px #188fd922'}}>
                          {t('help.guide','Guía')}
                        </button>
                        <button style={{background:'#7c3aed',color:'#fff',border:'none',borderRadius:12,padding:'12px 0',fontWeight:700,fontSize:'1.07rem',cursor:'pointer',boxShadow:'0 1px 6px #7c3aed22'}}>
                          {t('help.community','Comunidad')}
                        </button>
                        <button style={{background:'#f59e42',color:'#fff',border:'none',borderRadius:12,padding:'12px 0',fontWeight:700,fontSize:'1.07rem',cursor:'pointer',boxShadow:'0 1px 6px #f59e4222'}}>
                          {t('help.faq','Preguntas frecuentes')}
                        </button>
                      </div>
                    )}
                    {/* Modal de soporte */}
                    <Modal
                      isOpen={showSupportModal}
                      onRequestClose={() => setShowSupportModal(false)}
                      style={{
                        overlay: {
                          background: 'rgba(30,30,40,0.25)',
                          zIndex: 10000,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        content: {
                          position: 'static',
                          maxWidth: 360,
                          width: '92%',
                          maxHeight: 420,
                          borderRadius: 18,
                          padding: '28px 22px',
                          background: darkMode ? '#232a3b' : '#fff',
                          color: darkMode ? '#fff' : '#232a3b',
                          border: 'none',
                          boxShadow: '0 4px 32px #0002',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 14,
                          margin: 0,
                          inset: 'unset',
                        }
                      }}
                      ariaHideApp={false}
                    >
                      <h2 style={{fontWeight:800,fontSize:'1.18rem',marginBottom:6,textAlign:'center'}}>{t('help.contactSupport')}</h2>
                      <div style={{fontSize:'0.98rem',color:darkMode?'#b5c6e0':'#4b5563',marginBottom:14,textAlign:'center'}}>{t('help.contactSupportSubtitle','¿Cómo quieres contactar a nuestro equipo de soporte?')}</div>
                      <div style={{display:'flex',flexDirection:'column',gap:12,width:'100%'}}>
                        <button onClick={()=>window.open('mailto:soporte@aura.com','_blank')} style={{background:'#188fd9',color:'#fff',border:'none',borderRadius:10,padding:'11px 0',fontWeight:700,fontSize:'1.06rem',cursor:'pointer',boxShadow:'0 1px 6px #188fd922',width:'100%'}}>{t('help.contactByEmail','Contactar por email')}</button>
                        <button onClick={()=>window.open('https://aura.com/chatsoporte','_blank')} style={{background:'#10b981',color:'#fff',border:'none',borderRadius:10,padding:'11px 0',fontWeight:700,fontSize:'1.06rem',cursor:'pointer',boxShadow:'0 1px 6px #10b98122',width:'100%'}}>{t('help.contactByChat','Contactar por chat')}</button>
                      </div>
                      <button onClick={()=>setShowSupportModal(false)} style={{marginTop:14,background:'none',color:darkMode?'#fff':'#232a3b',border:'none',fontWeight:600,fontSize:'1.03rem',cursor:'pointer',textDecoration:'underline'}}>{t('settings.close','Cerrar')}</button>
                    </Modal>
                    
                  </div>
                  <button
                    className="aura-login-btn"
                    style={{
                      background: '#e53e3e',
                      color: '#fff',
                      fontSize: '1.05rem',
                      padding: '11px 26px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      minWidth: '135px',
                      marginRight: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                    onClick={handleLogout}
                  >
                    {t('settings.logout')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <main style={{marginTop:'110px'}}>
        {!sesionIniciada ? (
          <>
            {/* Espacio entre barra superior y banner */}
            <div style={{height: 0}} />
            {/* Fondo blanco central */}
            <div className="aura-body">
              <div className="aura-banner">
                <div className="aura-banner-left">
                  <h1 style={{fontWeight:900, fontSize:'2.7rem', color:'#232a3b', marginBottom:16, lineHeight:1.08, letterSpacing:'-1px'}}>
                    Automatiza la gestión de Instagram para Magneto con <span style={{color:'#188fd9'}}>Aura</span>
                  </h1>
                  <div className="aura-banner-desc" style={{fontSize:'1.18rem', marginBottom:18, color:'#232a3b', fontWeight:500}}>
                    El CMS inteligente que vincula tus cuentas, escucha interacciones y responde con IA Neto. Gestiona vacantes, eventos y reuniones desde un panel visual, seguro y fácil de usar.
                  </div>
                  <ul className="aura-banner-list" style={{marginBottom:22, marginTop:2}}>
                    <li style={{color:'#188fd9', fontWeight:700, fontSize:'1.08rem', marginBottom:4}}>🔗 Vinculación y administración de múltiples cuentas de Instagram</li>
                    <li style={{color:'#10b981', fontWeight:700, fontSize:'1.08rem', marginBottom:4}}>🤖 Respuestas automáticas y personalizadas con IA Neto</li>
                    <li style={{color:'#7c3aed', fontWeight:700, fontSize:'1.08rem', marginBottom:4}}>📊 Panel filtrable por categorías y cuentas vinculadas</li>
                    <li style={{color:'#f59e42', fontWeight:700, fontSize:'1.08rem', marginBottom:4}}>📈 Análisis de tendencias y estadísticas en tiempo real</li>
                    <li style={{color:'#232a3b', fontWeight:700, fontSize:'1.08rem', marginBottom:4}}>🛠️ Configuración avanzada de respuestas y simulación de conversaciones</li>
                    <li style={{color:'#188fd9', fontWeight:700, fontSize:'1.08rem', marginBottom:4}}>🔔 Alertas y notificaciones inteligentes</li>
                  </ul>
                  <button
                    className="aura-banner-cta"
                    style={{marginBottom:20, fontSize:'1.18rem', background:'linear-gradient(90deg,#188fd9 60%,#10b981 100%)', color:'#fff', fontWeight:800, border:'none', borderRadius:10, padding:'14px 38px', boxShadow:'0 4px 16px rgba(16,185,129,0.13)', letterSpacing:'1px'}}
                    onClick={() => setShowLogin(true)}
                  >
                    ¡Accede ahora al panel Aura!
                  </button>
                  <div style={{fontSize:'1.05rem', marginTop:10, color:'#232a3b', fontWeight:500}}>
                    ¿Aún no tienes cuenta? <button className="aura-register-link" style={{color:'#188fd9', fontWeight:700, background:'none', border:'none', textDecoration:'underline', cursor:'pointer', fontSize:'1.05rem'}} onClick={()=>setShowRegister(true)}>Regístrate y prueba Aura hoy</button>
                  </div>
                </div>
                <div className="aura-banner-right" style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <div style={{background: 'none', borderRadius: '32px', boxShadow: 'none', padding: 0, maxWidth: 420, width: '100%', minHeight: 'unset', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {/* Mockup de celular */}
                    {/* Mockup realista de chat de Instagram en un celular */}
                    <div style={{
                      background: '#f5f6fa',
                      borderRadius: '38px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                      width: 440,
                      minHeight: 620,
                      maxHeight: 690,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      border: '1.5px solid #e0e0e0',
                      overflow: 'hidden'
                    }}>
                      {/* Muesca superior tipo notch */}
                      <div style={{width: 70, height: 10, background: '#232a3b', borderRadius: 8, position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', opacity: 0.18}}></div>
                      {/* Header Instagram */}
                      <div style={{
                        width: '100%',
                        height: 72,
                        background: '#fff',
                        borderBottom: '1.5px solid #ececec',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 24px',
                        boxSizing: 'border-box',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                          <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="avatar" style={{width: 36, height: 36, borderRadius: '50%', border: '2px solid #e0e0e0'}} />
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{fontWeight: 700, color: '#232a3b', fontSize: 16}}>Neto <span style={{fontWeight:400, color:'#8e8e8e', fontSize:13}}>Chatbot</span></span>
                            <span style={{fontSize: 12, color: '#bdbdbd'}}>Instagram</span>
                          </div>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style={{width: 28, height: 28}} />
                      </div>
                      {/* Chat area */}
                      <div style={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        padding: '10px 16px 2px 16px',
                        boxSizing: 'border-box',
                        gap: 12,
                        background: 'linear-gradient(180deg, #f5f6fa 80%, #e9e9f3 100%)',
                        overflowY: 'auto'
                      }}>
                        {/* Mensaje Neto */}
                        <div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
                          <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="avatar" style={{width: 28, height: 28, borderRadius: '50%', border: '2px solid #e0e0e0'}} />
                          <div style={{
                            background: 'linear-gradient(135deg, #aa22ffff 0%, #ff9900ff 100%)',
                            color: '#fff',
                            borderRadius: '18px 18px 18px 6px',
                            padding: '13px 18px',
                            maxWidth: 295,
                            fontWeight: 500,
                            fontSize: 14,
                            boxShadow: '0 2px 8px rgba(185,122,223,0.10)'
                          }}>
                            ¡Hola! Soy Neto, el chatbot de Aura.<br/>He notado que reaccionaste a una publicación.<br/>¿Te gustaría recibir más información sobre ella?
                          </div>
                        </div>
                        {/* Mensaje usuario */}
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                          <div style={{
                            background: 'linear-gradient(90deg, #0fc588ff 60%, #228fd3ff 100%)',
                            color: '#fff',
                            borderRadius: '18px 18px 6px 18px',
                            padding: '13px 18px',
                            maxWidth: 220,
                            fontWeight: 500,
                            fontSize: 14,
                            boxShadow: '0 2px 8px rgba(16,185,129,0.10)'
                          }}>
                            ¡Sí! Me interesa saber más.
                          </div>
                        </div>
                        {/* Mensaje Neto */}
                        <div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
                          <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="avatar" style={{width: 28, height: 28, borderRadius: '50%', border: '2px solid #e0e0e0'}} />
                          <div style={{
                            background: 'linear-gradient(135deg, #aa22ffff 0%, #ff9900ff 100%)',
                            color: '#fff',
                            borderRadius: '18px 18px 18px 6px',
                            padding: '13px 18px',
                            maxWidth: 220,
                            fontWeight: 500,
                            fontSize: 14,
                            boxShadow: '0 2px 8px rgba(185,122,223,0.10)'
                          }}>
                            Aura escucha tu red social y detecta interacciones o reacciones en tus publicaciones.<br/>Cuando alguien reacciona, Neto inicia una conversación para enviarle información relevante sobre la publicación de su interés.<br/>¡Funciona 24/7 y es totalmente gratis!
                          </div>
                        </div>
                        {/* Mensaje usuario */}
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                          <div style={{
                            background: 'linear-gradient(90deg, #0fc588ff 60%, #228fd3ff 100%)',
                            color: '#fff',
                            borderRadius: '18px 18px 6px 18px',
                            padding: '13px 18px',
                            maxWidth: 220,
                            fontWeight: 500,
                            fontSize: 14,
                            boxShadow: '0 2px 8px rgba(16,185,129,0.10)'
                          }}>
                            ¡Genial! ¿Cómo lo activo?
                          </div>
                        </div>
                        {/* Mensaje Neto final */}
                        <div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
                          <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="avatar" style={{width: 28, height: 28, borderRadius: '50%', border: '2px solid #e0e0e0'}} />
                          <div style={{
                            background: 'linear-gradient(135deg, #aa22ffff 0%, #ff9900ff 100%)',
                            color: '#fff',
                            borderRadius: '18px 18px 18px 6px',
                            padding: '13px 18px',
                            maxWidth: 220,
                            fontWeight: 700,
                            fontSize: 14,
                            boxShadow: '0 2px 8px rgba(255,179,71,0.10)'
                          }}>
                            Solo haz clic en <span style={{color:'#fff', fontWeight:800}}>¡Empieza gratis!</span> y crea tu cuenta. ¡Bienvenido a Aura!
                          </div>
                        </div>
                      </div>
                      {/* Barra de mensaje inferior */}
                      <div style={{
                        width: '100%',
                        height: 44,
                        background: '#fff',
                        borderTop: '1.5px solid #ececec',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 14px',
                        boxSizing: 'border-box',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: 2
                      }}>
                        <input type="text" disabled value="Escribe un mensaje..." style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontSize: 15,
                          color: '#bdbdbd',
                          fontStyle: 'italic'
                        }} />
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b97adf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer fijo */}
            <footer className="aura-footer">
              <div className="aura-footer-content">
                <div className="aura-footer-cols">
                  <div>
                    <b>Nuestro producto</b>
                    <ul>
                      <li>Vinculación de cuentas Instagram</li>
                      <li>Escucha y análisis de interacciones</li>
                      <li>Chatbot IA Neto</li>
                      <li>Panel de análisis y tendencias</li>
                      <li>Respuestas automáticas configurables</li>
                      <li>Simulación de conversaciones</li>
                      <li>Análisis de feed y rendimiento</li>
                    </ul>
                  </div>
                  <div>
                    <b>Recursos</b>
                    <ul>
                      <li>Panel de análisis y métricas</li>
                      <li>Simulación de interacciones</li>
                      <li>Preguntas frecuentes</li>
                      <li>Documentación técnica</li>


                    </ul>
                  </div>
                  <div>
                    <b>Sobre Nosotros</b>
                    <ul>
                      <li>Comunidad Aura</li>
                      <li>Soporte y contacto</li>
                    </ul>
                  </div>
                  <div className="aura-footer-newsletter">
                    <span>Recibe lo último sobre automatización y Aura en tu correo</span>
                    <div className="aura-footer-newsletter-form">
                      <input id="newsletter-email" type="email" placeholder="Correo electrónico" style={{fontSize:15}} />
                      <button
                        style={{fontWeight:600, fontSize:15, background:'linear-gradient(90deg,#10b981 0%,#188fd9 100%)', color:'#fff', border:'none', borderRadius:6, padding:'8px 18px', marginLeft:8, cursor:'pointer'}}
                        id="newsletter-suscribirse-btn"
                        type="button"
                        disabled={false}
                      >Suscribirse</button>
                    </div>
                  </div>
                </div>
                <div className="aura-footer-bottom">
                  <span>Todos los derechos reservados © Aura. 2025</span>
                  <div className="aura-footer-social" style={{marginTop:-10, display:'flex', gap:18, alignItems:'center', marginLeft:'auto', marginRight:'40px'}}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="2"/>
                        <path d="M13.5 8.5h-1.2c-.28 0-.3.13-.3.32v1.18h1.5l-.2 1.5h-1.3V17h-1.6v-5.5h-1.1v-1.5h1.1v-1.1c0-1.1.6-1.7 1.7-1.7h1.3v1.3z" stroke="#fff" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2"/>
                        <circle cx="17" cy="7" r="1" fill="#fff"/>
                      </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#fff" strokeWidth="2"/>
                        <path d="M7 10v7M7 7v.01M12 10v7m0 0v-4a2 2 0 0 1 4 0v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 5.92a8.38 8.38 0 0 1-2.36.65 4.13 4.13 0 0 0 1.81-2.27 8.19 8.19 0 0 1-2.6.99A4.13 4.13 0 0 0 12 8.13c0 .32.04.63.1.93A11.7 11.7 0 0 1 3.1 4.87a4.13 4.13 0 0 0 1.28 5.5 4.07 4.07 0 0 1-1.87-.52v.05a4.13 4.13 0 0 0 3.31 4.05 4.13 4.13 0 0 1-1.86.07 4.13 4.13 0 0 0 3.85 2.86A8.3 8.3 0 0 1 2 19.54a11.7 11.7 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.18 8.18 0 0 0 22 5.92z" stroke="#fff" strokeWidth="2"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
            {/* Modals */}
            <LoginModal
              isOpen={showLogin}
              onClose={() => setShowLogin(false)}
              onLogin={handleLogin}
              errorMsg={loginError}
              onOpenRecovery={() => { setShowLogin(false); setShowRecovery(true); }}
              onOpenVerifyEmail={email => {
                setPendingEmail(email);
                setShowLogin(false);
                setShowEmailVerify(true);
              }}
            />
            <PasswordRecoveryModal
              isOpen={showRecovery}
              onClose={() => setShowRecovery(false)}
              onSendRecovery={handleSendRecovery}
              errorMsg={recoveryError}
            />
            {showResetModal && recoveryStep === 'code' && (
              <PasswordResetModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onReset={handleVerifyRecoveryCode}
                email={recoveryEmail}
                errorMsg={recoveryError}
                step="code"
              />
            )}
            {showResetModal && recoveryStep === 'newpass' && (
              <PasswordResetModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onReset={handleResetPassword}
                email={recoveryEmail}
                errorMsg={recoveryError}
                step="newpass"
              />
            )}
  const [showRecovery, setShowRecovery] = useState(false);
            <EmailVerifyModal
              isOpen={showEmailVerify}
              onClose={() => setShowEmailVerify(false)}
              onSubmit={async email => {
                try {
                  const res = await fetch(`${BACKEND_URL}/api/reenviar-verificacion`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo: email })
                  });
                  if (!res.ok) {
                    const errorData = await res.json();
                    toast.error(errorData.error || 'No se pudo enviar el código');
                    return;
                  }
                  toast.success('¡Código de verificación enviado! Revisa tu correo.');
                  setPendingEmail(email);
                  setShowEmailVerify(false);
                  setShowVerify(true);
                } catch (err) {
                  toast.error('Error al enviar el código de verificación');
                }
              }}
            />
            {/* ¿Olvidaste tu contraseña? Solo texto, sin acción ni modal. */}
            <RegisterModal
              isOpen={showRegister}
              onClose={() => setShowRegister(false)}
              onRegister={handleRegister}
              errorMsg={registerError}
            />
            <VerifyModal
              isOpen={showVerify}
              onClose={() => setShowVerify(false)}
              onVerify={handleVerify}
              correo={pendingEmail}
              errorMsg={verifyError}
            />
            {registerSuccess && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#fff', borderRadius: 10, width: 350, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', position: 'relative', textAlign: 'center' }}>
                  <h2 style={{ marginBottom: 16, color: '#10b981' }}>¡Registro verificado!</h2>
                  <div style={{ marginBottom: 18, color: '#444', fontSize: 15 }}>Ahora puedes iniciar sesión con tu cuenta.</div>
                  <button onClick={() => setRegisterSuccess(false)} style={{ width: '100%', background: '#188FD9', color: '#fff', border: 'none', borderRadius: 6, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cerrar</button>
                </div>
              </div>
            )}
            <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
          </>
        ) : (
          <>
            {/* Fondo blanco y sin barra lateral */}
            <div style={{ minHeight: '100vh', background: '#fff', width: '100%', display: 'flex', flexDirection: 'row' }}>
              {/* Header fijo con botones */}
              <div style={{ width: '100%', height: 100, background: '#fff', position: 'fixed', top: 0, left: 0, zIndex: 200, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32, paddingTop: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {/* Logo y nuevos iconos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <img src={logo} alt="Logo Aura" className="aura-logo" style={{marginLeft: 0, marginRight: 0}} />
                  {/* Botones de simulación para pruebas, ocultos por comentario */}
                  {false && (
                  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => {
                        setNotifications(n => [
                          { id: Date.now() + Math.random(), text: 'Notificación de prueba', date: new Date().toLocaleTimeString() },
                          ...n
                        ]);
                        setNotificationCount(c => c + 1);
                      }}
                      style={{ background:'#ffb300', color:'#222', border:'2px solid #e53e3e', borderRadius:8, fontSize:15, fontWeight:700, padding:'8px 16px', cursor:'pointer', boxShadow:'0 2px 8px #e53e3e55' }}
                    >+1 notif</button>
                    <button
                      onClick={() => {
                        setNotifications([]);
                        setNotificationCount(0);
                      }}
                      style={{ background:'#e53e3e', color:'#fff', border:'2px solid #ffb300', borderRadius:8, fontSize:15, fontWeight:700, padding:'8px 16px', cursor:'pointer', boxShadow:'0 2px 8px #ffb30055' }}
                    >Clear</button>
                  </div>
                  )}
                  {sesionIniciada && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        title="Notificaciones"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                        onClick={() => notificationsEnabled && setShowNotifications(true)}
                        aria-label="Notificaciones"
                      >
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: notificationsEnabled ? '#1EE6D9' : '#e0e0e0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          position: 'relative'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5S10.5 3.2 10.5 4v.7C7.6 8.4 6 10.9 6 14v5l-1.7 1.7c-.2.2-.3.5-.3.8v.5c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-.5c0-.3-.1-.6-.3-.8L18 16z" fill="#FFD600"/>
                          </svg>
                          {/* X gris si está desactivado */}
                          {!notificationsEnabled && (
                            <svg width="16" height="16" style={{position:'absolute',top:2,right:2}} viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="8" fill="#fff"/>
                              <path d="M5 5l6 6M11 5l-6 6" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          )}
                          {/* Contador si está activado */}
                          {notificationsEnabled && (
                            <span style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: notificationCount > 0 ? '#e53e3e' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 700,
                              color: notificationCount > 0 ? '#fff' : '#888',
                              border: '2px solid #fff',
                              boxShadow: notificationCount > 0 ? '0 0 4px #e53e3e55' : 'none',
                              zIndex: 2
                            }}>
                              {notificationCount}
                            </span>
                          )}
                        </span>
                      </button>
                      <button
                        title="Perfil"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => {/* lógica para abrir perfil */}}
                        aria-label="Perfil"
                      >
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#36C6F0',
                          border: '3px solid #fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" fill="#fff"/>
                          </svg>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Solo el botón de cerrar sesión permanece aquí, los iconos están junto al logo */}
                  <button
                    onClick={handleLogout}
                    style={{
                      background: '#e53e3e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 22px',
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    {t('settings.logout')}
                  </button>
                </div>
              </div>
              {/* Barra lateral pegada a la superior */}
          <aside style={{ width: 320, background: '#0a2342', height: 'calc(100dvh - 100px)', position: 'fixed', top: 98, left: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, zIndex: 300, overflow: 'hidden' }}>
                <nav style={{ width: '100%' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#fff', fontWeight: 500, fontSize: 15 }}>
                    <li
                      onClick={() => setPanelActivo('inicio')}
                      style={{
                        background: panelActivo === 'inicio' ? '#192e3a' : 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 32px',
                        borderLeft: panelActivo === 'inicio' ? '4px solid #1EE6D9' : '4px solid transparent',
                        fontWeight: 700,
                        boxShadow: panelActivo === 'inicio' ? '0 0 12px 2px #1EE6D9' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s'
                      }}
                    >
                      <FaHome style={{ marginRight: 16, fontSize: 20 }} /> {t('sidebar.home')}
                    </li>
                    <li
                      onClick={() => setPanelActivo('dashboard')}
                      style={{
                        background: panelActivo === 'dashboard' ? '#192e3a' : 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 32px',
                        borderLeft: panelActivo === 'dashboard' ? '4px solid #1EE6D9' : '4px solid transparent',
                        fontWeight: 700,
                        boxShadow: panelActivo === 'dashboard' ? '0 0 12px 2px #1EE6D9' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s'
                      }}
                    >
                      <FaChartBar style={{ marginRight: 16, fontSize: 20 }} /> {t('sidebar.dashboard')}
                    </li>
                    <li
                      onClick={() => setPanelActivo('tendencias')}
                      style={{
                        background: panelActivo === 'tendencias' ? '#192e3a' : 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 32px',
                        borderLeft: panelActivo === 'tendencias' ? '4px solid #1EE6D9' : '4px solid transparent',
                        fontWeight: 700,
                        boxShadow: panelActivo === 'tendencias' ? '0 0 12px 2px #1EE6D9' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s'
                      }}
                    >
                      <FaChartLine style={{ marginRight: 16, fontSize: 20 }} /> {t('sidebar.trends')}
                    </li>
                    <li
                      onClick={() => setPanelActivo('respuestas')}
                      style={{
                        background: panelActivo === 'respuestas' ? '#192e3a' : 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 32px',
                        borderLeft: panelActivo === 'respuestas' ? '4px solid #1EE6D9' : '4px solid transparent',
                        fontWeight: 700,
                        boxShadow: panelActivo === 'respuestas' ? '0 0 12px 2px #1EE6D9' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s'
                      }}
                    >
                      <FaComments style={{ marginRight: 16, fontSize: 20 }} /> {t('sidebar.responses')}
                    </li>
                    {/*
                    <li
                      onClick={() => setPanelActivo('datos')}
                      style={{
                        background: panelActivo === 'datos' ? '#192e3a' : 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 32px',
                        borderLeft: panelActivo === 'datos' ? '4px solid #1EE6D9' : '4px solid transparent',
                        fontWeight: 700,
                        boxShadow: panelActivo === 'datos' ? '0 0 12px 2px #1EE6D9' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s'
                      }}
                    >
                      <FaChartLine style={{ marginRight: 16, fontSize: 20, transform: 'rotate(-45deg)' }} /> {t('sidebar.data')}
                    </li>
                    */}
                    <li
                      onClick={() => setPanelActivo('prueba')}
                      style={{
                        background: panelActivo === 'prueba' ? '#192e3a' : 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 32px',
                        borderLeft: panelActivo === 'prueba' ? '4px solid #1EE6D9' : '4px solid transparent',
                        fontWeight: 700,
                        boxShadow: panelActivo === 'prueba' ? '0 0 12px 2px #1EE6D9' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s'
                      }}
                    >
                      <FaRobot style={{ marginRight: 16, fontSize: 20 }} /> {t('sidebar.test')}
                    </li>
                    <li
                      onClick={() => setPanelActivo('cuentas')}
                      style={{
                        background: panelActivo === 'cuentas' ? '#192e3a' : 'none',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 32px',
                        borderLeft: panelActivo === 'cuentas' ? '4px solid #1EE6D9' : '4px solid transparent',
                        fontWeight: 700,
                        boxShadow: panelActivo === 'cuentas' ? '0 0 12px 2px #1EE6D9' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border-color 0.2s'
                      }}
                    >
                      <FaUserPlus style={{ marginRight: 16, fontSize: 20 }} /> {t('sidebar.accounts')}
                    </li>
                  </ul>
                </nav>
                <div style={{ position: 'absolute', bottom: 48, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  {sesionIniciada && (
                    <>
                      <button
                        ref={ajustesBtnRef}
                        title={t('sidebar.settings')}
                        style={{
                          background: 'linear-gradient(90deg, #1EE6D9 0%, #36C6F0 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '10px 32px',
                          fontWeight: 700,
                          fontSize: '18px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          width: '80%',
                          textAlign: 'center',
                          margin: '0 auto'
                        }}
                        onClick={() => setShowSettings((v) => !v)}
                        aria-label="Ajustes"
                      >
                        {t('sidebar.settings')}
                      </button>
                      <div ref={settingsPanelRef} style={{display: showSettings ? 'block' : 'none'}}>
                        <SettingsPanel
                          visible={showSettings}
                          anchorRef={ajustesBtnRef}
                          onClose={() => setShowSettings(false)}
                          onLanguageChange={() => setLangRerender(v => v + 1)}
                          notificationsEnabled={notificationsEnabled}
                          setNotificationsEnabled={setNotificationsEnabled}
                          darkMode={darkMode}
                          setDarkMode={setDarkMode}
                          onSupport={() => setShowSupportModal(true)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </aside>
              {/* Contenido principal */}
              <div style={{ flex: 1, minHeight: '100vh', marginLeft: 320, background: 'var(--aura-main-bg, #181c24)', transition: 'background 0.3s' }}>
                {renderPanel()}
              </div>
            </div>
            <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
          </>
        )}
      </main>
    </>
  );
}

export default App;