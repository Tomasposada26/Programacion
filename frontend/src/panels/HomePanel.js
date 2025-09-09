import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, LinkedInIcon, TwitterIcon, FacebookIcon } from '../assets/SocialIcons';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import '../styles/HomePanel.css';
import logoAura from '../assets/logo-aura.png';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';
import VerifyModal from '../modals/VerifyModal';
import EmailVerifyModal from '../modals/EmailVerifyModal';
import PasswordResetModal from '../modals/PasswordResetModal';
import PasswordRecoveryModal from '../modals/PasswordRecoveryModal';
import ProductDropdown from '../components/ProductDropdown';
import ResourcesDropdown from '../components/ResourcesDropdown';
import AboutDropdown from '../components/AboutDropdown';

const HomePanel = ({ onLogin, onRegister, loginError, registerError, registerSuccess }) => {
  const { toast, showToast, hideToast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingUser, setPendingUser] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [resetStep, setResetStep] = useState('code');
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');

  // LOGIN
  const handleLogin = (user) => {
    setShowLogin(false);
    onLogin(user);
  };
  const handleOpenRecovery = () => {
    setShowLogin(false);
    setShowPasswordRecovery(true);
  };
  const handleOpenVerifyEmail = (usuario) => {
    setShowLogin(false);
    setPendingUser(usuario); // Guarda el usuario pendiente
    setShowEmailVerify(true);
  };

  // REGISTRO
  // REGISTRO
  const handleRegister = async (form) => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.ok) {
        setPendingEmail(form.correo);
        setShowRegister(false);
        setShowVerify(true);
        showToast('Registro exitoso. Revisa tu correo para el código de verificación.', 'success');
      } else {
        showToast(data.error || 'Error en el registro', 'error');
      }
    } catch {
      showToast('Error de red al registrar', 'error');
    }
  };

  // VERIFICAR CUENTA
  // VERIFICAR CUENTA
  const handleVerify = async (code) => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: pendingEmail, codigo: code })
      });
      const data = await res.json();
      if (data.ok) {
        setVerifyError('');
        setShowVerify(false);
        showToast(data.message || '¡Cuenta verificada! Ya puedes iniciar sesión.', 'success');
      } else {
        setVerifyError(data.error || data.message || 'Código incorrecto o expirado');
        showToast(data.error || data.message || 'Código incorrecto o expirado', 'error');
      }
    } catch {
      setVerifyError('Error de conexión');
      showToast('Error de conexión', 'error');
    }
  };

  // EMAIL VERIFY
  // REENVIAR VERIFICACIÓN
  const handleEmailVerify = async (email) => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/reenviar-verificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });
      const data = await res.json();
      if (data.ok) {
        setPendingEmail(email);
        setShowEmailVerify(false);
        setShowVerify(true);
        showToast('Nuevo código enviado a tu correo.', 'success');
      } else {
        setVerifyError(data.error || data.message || 'No se pudo reenviar el correo');
        showToast(data.error || data.message || 'No se pudo reenviar el correo', 'error');
      }
    } catch {
      setVerifyError('Error de conexión');
      showToast('Error de conexión', 'error');
    }
  };

  // RECUPERAR CONTRASEÑA
  // RECUPERAR CONTRASEÑA
  const handleSendRecovery = async (email) => {
    try {
  const res = await fetch('http://localhost:4000/api/auth/recovery/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });
      const data = await res.json();
      if (data.ok) {
        setResetError('');
        setShowPasswordRecovery(false);
        setResetEmail(email);
        setResetStep('code');
        setShowPasswordReset(true);
        showToast('Código de recuperación enviado a tu correo.', 'success');
      } else {
        setResetError(data.error || 'Correo no encontrado');
        showToast(data.error || 'Correo no encontrado', 'error');
      }
    } catch {
      setResetError('Error de conexión');
      showToast('Error de conexión', 'error');
    }
  };

  // RESTABLECER CONTRASEÑA
  const handleReset = async (password, repeat) => {
    try {
      if (resetStep === 'code') {
        // Aquí deberías verificar el código (ya implementado en tu flujo)
        setResetError('');
        setResetStep('newpass');
      } else {
        // Enviar nueva contraseña y repetir al backend
        const res = await fetch('http://localhost:4000/api/auth/recovery/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: resetEmail, contrasena: password, repetir: repeat })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setResetError(data.error || 'No se pudo cambiar la contraseña');
          return;
        }
        setResetError('');
        setShowPasswordReset(false);
        setShowLogin(true);
        showToast('Contraseña restablecida correctamente. Inicia sesión.', 'success');
      }
    } catch {
      setResetError('Error de conexión');
    }
  };

  // SUSCRIPCIÓN NEWSLETTER (footer)
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    if (!email) {
      showToast('Ingresa un correo válido.', 'error');
      e.target.reset();
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/interesados/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });
      const data = await res.json();
      if (data.ok) {
        showToast(data.message || '¡Suscripción exitosa! Revisa tu correo.', 'success');
      } else {
        showToast(data.message || 'Correo ya registrado', 'error');
      }
      e.target.reset();
    } catch {
      showToast('Error al suscribirse', 'error');
      e.target.reset();
    }
  };

  return (
  <div className="home-panel" style={{height: '100vh', overflowY: 'auto', overflowX: 'hidden'}}>
      {/* Header y menú superior */}
      <header className="aura-header">
        <div className="aura-logo">
          <img src={logoAura} alt="AURA Logo" />
        </div>
        <nav className="aura-navbar">
          <ul className="aura-menu">
            <li className="aura-menu-item">
              <ProductDropdown />
            </li>
            <li className="aura-menu-item">
              <ResourcesDropdown />
            </li>
            <li className="aura-menu-item">
              <AboutDropdown />
            </li>
          </ul>
        </nav>
        <div className="aura-header-actions">
          <button className="aura-login-btn" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
          <div className="aura-register-block">
            ¿Aún no tienes cuenta?
            <button className="aura-register-link" onClick={() => setShowRegister(true)}>Regístrate ahora</button>
          </div>
        </div>
      </header>

      {/* Banner de bienvenida */}
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
                minHeight: 680, // antes 620
                maxHeight: 770, // antes 690
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

      {/* Modales de login y registro */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onOpenRecovery={handleOpenRecovery}
        onOpenVerifyEmail={handleOpenVerifyEmail}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={handleRegister}
      />
      <VerifyModal
        isOpen={showVerify}
        onClose={() => setShowVerify(false)}
        onVerify={handleVerify}
        correo={pendingEmail}
        errorMsg={verifyError}
      />
      <EmailVerifyModal
        isOpen={showEmailVerify}
        onClose={() => setShowEmailVerify(false)}
        onSubmit={handleEmailVerify}
        usuario={pendingUser}
      />
      <PasswordRecoveryModal
        isOpen={showPasswordRecovery}
        onClose={() => setShowPasswordRecovery(false)}
        onSendRecovery={handleSendRecovery}
        errorMsg={resetError}
      />
      <PasswordResetModal
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
        onReset={handleReset}
        email={resetEmail}
        errorMsg={resetError}
        step={resetStep}
      />

      {/* Footer */}
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
                <li><a href="https://discord.gg/XsTcyd95" target="_blank" rel="noopener noreferrer" className="footer-link">Comunidad Aura</a></li>
                <li><Link to="/soporte" className="footer-link">Soporte y contacto</Link></li>
                <li><Link to="/politicasdeprivacidad" className="footer-link">Políticas de privacidad</Link></li>
                <li><Link to="/terminosycondiciones" className="footer-link">Términos y condiciones</Link></li>
                <li><Link to="/politicasdeeliminacion" className="footer-link">Políticas de eliminación</Link></li>
              </ul>
            </div>
            <div className="aura-footer-newsletter">
              <b>Recibe lo último sobre automatización y Aura en tu correo</b>
              <form className="aura-footer-newsletter-form" onSubmit={handleSubscribe}>
                <input type="email" placeholder="Correo electrónico" />
                <button type="submit">Suscribirse</button>
              </form>

            </div>
          </div>

          <div className="aura-footer-bottom">
            <div className="aura-footer-bottom-content">
              <span>© {new Date().getFullYear()} Aura. Todos los derechos reservados.</span>
              <span className="aura-footer-socials">
                <a href="https://www.instagram.com/magnetoempleos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon style={{ verticalAlign: 'middle', margin: '0 6px' }} /></a>
                <a href="https://co.linkedin.com/company/magnetoempleos" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon style={{ verticalAlign: 'middle', margin: '0 6px' }} /></a>
                <a href="https://x.com/magnetoempleos" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><TwitterIcon style={{ verticalAlign: 'middle', margin: '0 6px' }} /></a>
                <a href="https://www.facebook.com/MagnetoEmpleos/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon style={{ verticalAlign: 'middle', margin: '0 6px' }} /></a>
              </span>
            </div>

          </div>
        </div>
      </footer>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      </div>
      );
    };

export default HomePanel;
