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

  // Notificaciones unificadas
  const [globalNotifications, setGlobalNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Sincronizar contador con la cantidad real de notificaciones
  useEffect(() => {
    setNotificationCount(globalNotifications.length);
  }, [globalNotifications]);
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


    const userId = userData?._id;
    if (userId) {
      // Notificaciones generales y de cuentas
      let generales = [];
      let cuentas = [];
      try {
        const notifRes = await fetchWithAuth(
          `${BACKEND_URL}/api/notificaciones?userId=${encodeURIComponent(userId)}`,
          {},
          handleLogout
        );
        if (notifRes.ok) {
          const notifs = await notifRes.json();
          generales = Array.isArray(notifs) ? notifs.map(n => ({ ...n, _tipo: 'general' })) : [];
        }
      } catch {}
      try {
        const cuentasRes = await fetchWithAuth(
          `${BACKEND_URL}/api/accounts/account-notifications?userId=${encodeURIComponent(userId)}`,
          {},
          handleLogout
        );
        if (cuentasRes.ok) {
          const cuentasArr = await cuentasRes.json();
          cuentas = Array.isArray(cuentasArr) ? cuentasArr.map(n => ({ ...n, _tipo: 'cuenta' })) : [];
        }
      } catch {}
      const todas = [...generales, ...cuentas];
      setGlobalNotifications(todas);
      setNotificationCount(todas.length);

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
    } else {
      setGlobalNotifications([]);
      setNotificationCount(0);
      setAccounts([]);
    }

    setSesionIniciada(true);
  };

  const handleRegister = async (data) => {
    // Aquí iría la lógica real de registro
    setRegisterSuccess(true);
    setRegisterError('');
  };

  // Guardar notificaciones unificadas antes de cerrar sesión o pestaña
  const persistGlobalNotifications = useCallback((logoutFn) => {
    if (!user || !user._id || !Array.isArray(globalNotifications) || globalNotifications.length === 0) return;
    // Separar por tipo
    const generales = globalNotifications.filter(n => n._tipo === 'general').map(({ _tipo, ...n }) => n);
    const cuentas = globalNotifications.filter(n => n._tipo === 'cuenta').map(({ _tipo, ...n }) => n);
    // Guardar generales
    if (generales.length > 0) {
      fetchWithAuth(
        `${BACKEND_URL}/api/notificaciones/guardar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, notificaciones: generales })
        },
        logoutFn
      );
    }
    // Guardar cuentas
    if (cuentas.length > 0) {
      fetchWithAuth(
        `${BACKEND_URL}/api/accounts/account-notifications/guardar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, notifications: cuentas })
        },
        logoutFn
      );
    }
  }, [user, globalNotifications, BACKEND_URL]);

  // Usar el endpoint correcto para cuentas simuladas
  const persistAccounts = useCallback((logoutFn) => {
    if (!user || !user.token || !Array.isArray(accounts) || accounts.length === 0) return;
    const payload = {
      accounts: accounts.map(acc => ({
        username: acc.username,
        linkedAt: acc.linkedAt,
        active: acc.active,
        expiresAt: acc.expiresAt
      }))
    };
    const url = `${BACKEND_URL}/api/instagram-token/bulk-save`;
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      },
      logoutFn
    );
  }, [user, accounts, BACKEND_URL]);

  const handleLogout = useCallback(async () => {
    // Guarda cuentas y notificaciones unificadas antes de salir
    persistAccounts(handleLogout);
    persistGlobalNotifications(handleLogout);

    setSesionIniciada(false);
    setUser(null);
    setDarkMode(false);
    setGlobalNotifications([]);
    setNotificationCount(0);
    setAccounts([]);
  }, [persistAccounts, persistGlobalNotifications]);

  // Guardar notifs unificadas antes de cerrar pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      persistGlobalNotifications();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [persistGlobalNotifications]);

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
                  globalNotifications={globalNotifications}
                  setGlobalNotifications={setGlobalNotifications}
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
//prueba
export default App;
