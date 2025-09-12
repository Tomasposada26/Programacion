// App.jsx limpio (sin bloques duplicados)

import React, { useState, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import fetchWithAuth from './utils/fetchWithAuth';
import HomePanel from './panels/HomePanel';
import AuraPanel from './panels/AuraPanel';
import { persistInstagramAccountsOnLogout } from './panels/CuentasPanel';

import PoliticasPrivacidad from './legal/PoliticasPrivacidad';
import TerminosCondiciones from './legal/TerminosCondiciones';
import PoliticasEliminacion from './legal/PoliticasEliminacion';
import SoportePanel from './panels/SoportePanel';

// URL del backend (ajusta si usas variable de entorno)
const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';

function App() {
  // Autenticación / usuario
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [user, setUser] = useState(null);

  // IG accounts
  const [accounts, setAccounts] = useState([]);

  // Notificaciones
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // UI estado adicional
  const [darkMode, setDarkMode] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const helpBtnRef = useRef(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsPanelRef = useRef(null);

  // Registro / verificación
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  // Placeholders para props requeridas por AuraPanel (ajusta con lógica real cuando la tengas)
  const handleVerifyRecoveryCode = () => console.log('handleVerifyRecoveryCode');
  const handleResetPassword = () => console.log('handleResetPassword');
  const handleVerify = () => console.log('handleVerify');
  const handleUserUpdate = (updated) => setUser(prev => ({ ...prev, ...updated }));

  // Login
  const handleLogin = async (data) => {
    setSesionIniciada(true);
    let userData = null;
    try {
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
    } catch {
      setUser({
        usuario: data.usuario,
        correo: data.correo,
        token: data.token,
        ultimaConexion: data.ultimaConexion
      });
    }

    // Notificaciones
    try {
      if (userData && userData._id) {
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
      } else {
        setNotifications([]);
        setNotificationCount(0);
      }
    } catch {
      setNotifications([]);
      setNotificationCount(0);
    }

    setLoginError('');

    // Cuentas IG
    if (userData && userData._id && data.token) {
      try {
        const resAcc = await fetch(
          `${BACKEND_URL}/api/instagram-token/user-accounts`,
          { headers: { Authorization: `Bearer ${data.token}` } }
        );
        if (resAcc.ok) {
          const igAccounts = await resAcc.json();
          setAccounts(
            igAccounts.map(acc => ({
              ...acc,
              profile_picture_url: 'https://ui-avatars.com/api/?name=IG',
              timeToExpire: '59d 23h',
              isExpiringSoon: false,
              linkedAt: acc.linkedAt ? new Date(acc.linkedAt).toLocaleString() : 'N/A',
              autoRefresh: true,
              refreshing: false
            }))
          );
        } else {
          setAccounts([]);
        }
      } catch {
        setAccounts([]);
      }
    }
  };

  // Registro (simplificado)
  const handleRegister = async () => {
    setRegisterSuccess(true);
    setRegisterError('');
  };

  // Persistir notificaciones
  const persistNotifications = useCallback((logoutFn) => {
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
  }, [user, notifications]);

  // Logout
  const handleLogout = useCallback(async () => {
    persistNotifications(handleLogout);
    await persistInstagramAccountsOnLogout(accounts, user);
    setSesionIniciada(false);
    setUser(null);
    setAccounts([]);
    setDarkMode(false);
    setShowNotifications(false);
    setShowHelpDropdown(false);
  }, [persistNotifications, accounts, user]);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/"
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
                  showSupportModal={showSupportModal}
                  setShowSupportModal={setShowSupportModal}
                  showProfile={showProfile}
                  setShowProfile={setShowProfile}
                  showNotifications={showNotifications}
                  setShowNotifications={setShowNotifications}
                  showSettings={showSettings}
                  setShowSettings={setShowSettings}
                  showHelpDropdown={showHelpDropdown}
                  setShowHelpDropdown={setShowHelpDropdown}
                  settingsPanelRef={settingsPanelRef}
                  helpBtnRef={helpBtnRef}
                  loginError={loginError}
                  registerError={registerError}
                  verifyError={verifyError}
                  pendingEmail={pendingEmail}
                  registerSuccess={registerSuccess}
                  handleVerifyRecoveryCode={handleVerifyRecoveryCode}
                  handleResetPassword={handleResetPassword}
                  handleVerify={handleVerify}
                  onUserUpdate={handleUserUpdate}
                  handleUserUpdate={handleUserUpdate}
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
          <Route path="/privacidad" element={<PoliticasPrivacidad />} />
          <Route path="/terminos" element={<TerminosCondiciones />} />
          <Route path="/eliminacion-datos" element={<PoliticasEliminacion />} />
          <Route path="/soporte" element={<SoportePanel user={user} />} />
        </Routes>
      </Router>
    </>
  );
}
// prueba
export default App;