import React, { useState, useCallback, useEffect, useRef } from 'react';
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

function App() {
  // Cuentas IG simuladas
  const [accounts, setAccounts] = useState([]);

  // Ayuda
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const helpBtnRef = useRef(null);

  // Autenticación
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [user, setUser] = useState(null);

  // Notificaciones
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // UI
  const [darkMode, setDarkMode] = useState(false);

  // Errores / estados de auth
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';

  const handleLogin = async (data) => {

    setLoginError('');
    let userData = null;

    try {
      // OJO: revisa la ruta (posible doble /api/)
      const res = await fetchWithAuth(
        `${BACKEND_URL}/api/usuarios/api/usuario/info?usuario=${encodeURIComponent(data.usuario)}`,
        {},
        handleLogout
      );
      if (!res.ok) throw new Error('No se pudo obtener datos de usuario');
      userData = await res.json();
      console.log('[LOGIN] Respuesta userData:', userData);
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
        edad: userData.edad,
        token: data.token // si lo tienes al hacer login
      });
      // Si la respuesta del backend trae cuentas IG, úsalas directamente
      if (userData.accounts) {
        console.log('[LOGIN] Cuentas IG recibidas:', userData.accounts);
        setAccounts(Array.isArray(userData.accounts) ? userData.accounts : []);
      } else {
        console.log('[LOGIN] No se recibieron cuentas IG en userData');
      }
    } catch (err) {
      // Fallback mínimo
      console.error('[LOGIN] Error al procesar login:', err);
      setUser({
        usuario: data.usuario,
        correo: data.correo,
        token: data.token,
        ultimaConexion: data.ultimaConexion
      });
      setAccounts([]);
    }


    // Recuperar notificaciones, cuentas vinculadas y notificaciones de cuentas
    const userId = userData?._id;
    if (userId) {
      // Notificaciones generales
      try {
        const notifRes = await fetchWithAuth(
          `${BACKEND_URL}/api/notificaciones?userId=${encodeURIComponent(userId)}`,
          {},
          handleLogout
        );
        if (notifRes.ok) {
          const notifs = await notifRes.json();
          const arr = Array.isArray(notifs) ? notifs : [];
          setNotifications(arr);
          setNotificationCount(arr.length);
        } else {
          setNotifications([]);
          setNotificationCount(0);
        }
      } catch {
        setNotifications([]);
        setNotificationCount(0);
      }

      // Cuentas vinculadas
      try {
        const accRes = await fetchWithAuth(
          `${BACKEND_URL}/api/accounts/instagram-accounts?userId=${encodeURIComponent(userId)}`,
          {},
          handleLogout
        );
        if (accRes.ok) {
          const accs = await accRes.json();
          setAccounts(Array.isArray(accs) ? accs : []);
        } else {
          setAccounts([]);
        }
      } catch {
        setAccounts([]);
      }

      // Notificaciones de cuentas vinculadas
      try {
        const accNotifRes = await fetchWithAuth(
          `${BACKEND_URL}/api/accounts/account-notifications?userId=${encodeURIComponent(userId)}`,
          {},
          handleLogout
        );
        if (accNotifRes.ok) {
          // Puedes guardar en un estado aparte si lo necesitas
          // const accNotifs = await accNotifRes.json();
          // setAccountNotifications(Array.isArray(accNotifs) ? accNotifs : []);
        }
      } catch {}
    } else {
      setNotifications([]);
      setNotificationCount(0);
      setAccounts([]);
      // setAccountNotifications([]);
    }

    setSesionIniciada(true);
  };

  const handleRegister = async (data) => {
    // Aquí iría la lógica real de registro
    setRegisterSuccess(true);
    setRegisterError('');
  };

  const persistNotifications = useCallback((logoutFn) => {
    if (!user || !user._id || !Array.isArray(notifications) || notifications.length === 0) return;
    const payload = {
      userId: user._id,
      notificaciones: notifications.map(n => ({
        ...n,
        id: n.id || Date.now().toString() + Math.random().toString(36).slice(2),
        date: n.date ? new Date(n.date) : new Date()
      }))
    };
    const url = `${BACKEND_URL}/api/notificaciones/guardar`;

    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
        return;
      } catch {
        // fallback a fetch
      }
    }

    fetchWithAuth(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      logoutFn
    );
  }, [user, notifications, BACKEND_URL]);


  const persistAccounts = useCallback((logoutFn) => {
    if (!user || !user._id || !Array.isArray(accounts) || accounts.length === 0) return;
    const payload = {
      userId: user._id,
      accounts: accounts.map(acc => ({
        username: acc.username,
        linkedAt: acc.linkedAt,
        active: acc.active,
        expiresAt: acc.expiresAt
      }))
    };
    const url = `${BACKEND_URL}/api/accounts/instagram-accounts/guardar`;
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
        return;
      } catch {}
    }
    fetchWithAuth(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      logoutFn
    );
  }, [user, accounts, BACKEND_URL]);

  // Similar para notificaciones de cuentas vinculadas
  const persistAccountNotifications = useCallback((logoutFn) => {
    if (!user || !user._id || !Array.isArray(notifications) || notifications.length === 0) return;
    // Filtra solo las notificaciones de cuentas vinculadas
    const accountNotifs = notifications.filter(n => n.text && (
      n.text.includes('vinculada') || n.text.includes('desactivada') || n.text.includes('eliminada')
    ));
    if (accountNotifs.length === 0) return;
    const payload = {
      userId: user._id,
      notifications: accountNotifs.map(n => ({
        ...n,
        date: n.date ? new Date(n.date) : new Date()
      }))
    };
    const url = `${BACKEND_URL}/api/accounts/account-notifications/guardar`;
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
        return;
      } catch {}
    }
    fetchWithAuth(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      logoutFn
    );
  }, [user, notifications, BACKEND_URL]);

  const handleLogout = useCallback(async () => {
    // Guarda cuentas y notificaciones de cuentas antes de salir
    persistAccounts(handleLogout);
    persistAccountNotifications(handleLogout);
    persistNotifications(handleLogout);

    setSesionIniciada(false);
    setUser(null);
    setDarkMode(false);
    setNotifications([]);
    setNotificationCount(0);
    setAccounts([]);
    // setAccountNotifications([]);
  }, [persistAccounts, persistAccountNotifications, persistNotifications]);

  // Guardar notifs antes de cerrar pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      persistNotifications();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [persistNotifications]);

  const handleUserUpdate = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route path="/politicasdeprivacidad" element={<PoliticasPrivacidad />} />
          <Route path="/terminosycondiciones" element={<TerminosCondiciones />} />
          <Route path="/politicasdeeliminacion" element={<PoliticasEliminacion />} />
          <Route path="/soporte" element={<SoportePanel />} />
          <Route
            path="/*"
            element={
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
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;