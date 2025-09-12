  // Estado global de cuentas IG simuladas para bulk-save
  const [accounts, setAccounts] = useState([]);
import React, { useState } from 'react';
import fetchWithAuth from './utils/fetchWithAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePanel from './panels/HomePanel';
import AuraPanel from './panels/AuraPanel';
import PoliticasPrivacidad from './legal/PoliticasPrivacidad';
import TerminosCondiciones from './legal/TerminosCondiciones';
import PoliticasEliminacion from './legal/PoliticasEliminacion';
import SoportePanel from './panels/SoportePanel';

// URL del backend desde variable de entorno (escuchando en el puerto local)
// const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';


function App() {
  // Estado y ref para el modal de ayuda
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const helpBtnRef = React.useRef(null);
  // Estado de autenticación y usuario
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [user, setUser] = useState(null);
  //prueba
  // Estados globales para notificaciones
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);


  // Estado global de modo oscuro (solo para AuraPanel)
  const [darkMode, setDarkMode] = useState(false);

  // Estado para mostrar/ocultar el modal de notificaciones
  const [showNotifications, setShowNotifications] = useState(false);

  // Estados para errores y datos temporales
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Handlers principales
  // URL del backend (ajusta si tienes variable de entorno)
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';

  const handleLogin = async (data) => {
    setSesionIniciada(true);
  let userData = null;
    try {
      // Obtener datos completos del usuario tras login
      const res = await fetchWithAuth(
        `${BACKEND_URL}/api/usuarios/api/usuario/info?usuario=${encodeURIComponent(data.usuario)}`,
        {},
        handleLogout
      );
      if (!res.ok) throw new Error('No se pudo obtener datos de usuario');
      userData = await res.json();
      setUser({
        _id: userData._id,
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        usuario: userData.username,
        correo: userData.email,
        ultimaConexion: userData.ultimaConexion,
        ciudad: userData.ciudad,
        pais: userData.pais,
        genero: userData.genero,
        fecha_nacimiento: userData.fecha_nacimiento,
        edad: userData.edad
      });
    } catch (err) {
      setUser({
        usuario: data.usuario,
        correo: data.correo,
        token: data.token,
        ultimaConexion: data.ultimaConexion
      });
    }
    // Obtener notificaciones persistentes del backend
    try {
      const notifRes = await fetchWithAuth(
        `${BACKEND_URL}/api/notificaciones?userId=${encodeURIComponent(userData._id)}`,
        {},
        handleLogout
      );
      if (notifRes.ok) {
        const notifs = await notifRes.json();
        setNotifications(Array.isArray(notifs) ? notifs : []);
        setNotificationCount(Array.isArray(notifs) ? notifs.length : 0);
      } else {
        setNotifications([]);
        setNotificationCount(0);
      }
    } catch (e) {
      setNotifications([]);
      setNotificationCount(0);
    }
    setLoginError('');
  };

  const handleRegister = async (data) => {
    // Lógica de registro
    setRegisterSuccess(true);
    setRegisterError('');
  };




  // Guardar notificaciones en backend
  const persistNotifications = React.useCallback((logoutFn) => {
    if (!user || !user._id || !Array.isArray(notifications)) return;
    const payload = {
      userId: user._id,
      notificaciones: notifications.map(n => ({
        ...n,
        id: n.id || Date.now().toString() + Math.random().toString(36).slice(2),
        date: n.date ? new Date(n.date) : new Date()
      }))
    };
    const url = `${BACKEND_URL}/api/notificaciones/guardar`;
    // Usar sendBeacon si está disponible y es seguro
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetchWithAuth(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        logoutFn
      );
    }
  }, [user, notifications, BACKEND_URL]);

  // Guardar al cerrar sesión
  const handleLogout = React.useCallback(async () => {
    // Guardar cuentas IG simuladas en bulk antes de cerrar sesión
    if (accounts && accounts.length > 0 && user && user.token) {
      try {
        await fetch(`${BACKEND_URL}/api/instagram-token/bulk-save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ accounts: accounts.map(({ username, linkedAt, active }) => ({ username, linkedAt, active })) })
        });
      } catch (e) { /* opcional: manejar error */ }
    }
    persistNotifications(handleLogout);
    setSesionIniciada(false);
    setUser(null);
    setDarkMode(false);
  }, [persistNotifications, accounts, user, BACKEND_URL]);

  // Guardar al cerrar la pestaña
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      persistNotifications();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, notifications, persistNotifications]);

  // Renderizado principal
  // Handler para actualizar el usuario global tras editar el perfil
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <Router>
        <Routes>
          <Route path="/politicasdeprivacidad" element={<PoliticasPrivacidad />} />
          <Route path="/terminosycondiciones" element={<TerminosCondiciones />} />
          <Route path="/politicasdeeliminacion" element={<PoliticasEliminacion />} />
          <Route path="/soporte" element={<SoportePanel />} />
          <Route path="/*" element={
            sesionIniciada ? (
              <AuraPanel
                user={user}
                onLogout={handleLogout}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                notifications={notifications}
                setNotifications={setNotifications}
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
                notificationsEnabled={notificationsEnabled}
                setNotificationsEnabled={setNotificationsEnabled}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                showHelpDropdown={showHelpDropdown}
                setShowHelpDropdown={setShowHelpDropdown}
                helpBtnRef={helpBtnRef}
                onUserUpdate={handleUserUpdate}
                accounts={accounts}
                setAccounts={setAccounts}
              />
            ) : (
              <HomePanel
                onLogin={handleLogin}
                onRegister={handleRegister}
                loginError={loginError}
                registerError={registerError}
                registerSuccess={registerSuccess}
              />
            )
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;