import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import InstagramLinkCard from '../components/InstagramLinkCard';
import InstagramAccountsTable from '../components/InstagramAccountsTable';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import '../components/InstagramAccountsTable.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';

const CuentasPanel = ({ accounts, setAccounts, user }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [search, setSearch] = useState('');
  const [linking, setLinking] = useState(false);
  const [user, setUser] = useState(null); // Aquí deberías obtener el usuario logueado (JWT)

  // Simulación: obtener usuario logueado (reemplaza por tu lógica real)
  useEffect(() => {
    // Obtener el usuario logueado y su JWT real
    const token = localStorage.getItem('token');
    if (token) {
      try {
  const decoded = jwtDecode(token);
        // El backend espera req.user.id como userId
        setUser({ _id: decoded.id, username: decoded.username || decoded.usuario || '', token });
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // El fetch de cuentas ahora se hace en App/AuraPanel y se pasa por props

  // Formatear tiempo para expirar
  function formatTimeToExpire(expires_in, last_refresh) {
    if (!expires_in || !last_refresh) return 'N/A';
    const ms = (new Date(last_refresh).getTime() + expires_in * 1000) - Date.now();
    if (ms <= 0) return 'Expirado';
    const d = Math.floor(ms / (24*3600*1000));
    const h = Math.floor((ms % (24*3600*1000)) / (3600*1000));
    return `${d}d ${h}h`;
  }

  // Vincular cuenta (simulación: abre popup de Instagram OAuth)
  const handleLink = async () => {
    setLinking(true);
    // Simulación: generar un nombre de usuario aleatorio con @ delante
    const now = new Date();
    const randomName = () => {
      const realNames = [
        'sofia.gomez', 'juanpablo_23', 'cata.martinez', 'luisfer.photo', 'valen_fit',
        'andres.music', 'camila.makeup', 'dani_travels', 'maria.foodie', 'joseblog',
        'laura.art', 'mateo.tech', 'isa_runner', 'nico.gamer', 'caro.style',
        'pablo_chef', 'martina.books', 'santi.surf', 'alejandra.yoga', 'felipe.coffee'
      ];
      const suffix = Math.random() < 0.5 ? '' : Math.floor(Math.random() * 1000);
      return `@${realNames[Math.floor(Math.random() * realNames.length)]}${suffix}`;
    };
    const username = randomName();
    const fakeAccount = {
      _id: Math.random().toString(36).slice(2),
      username,
      profile_picture_url: 'https://ui-avatars.com/api/?name=IG',
      timeToExpire: '59d 23h',
      isExpiringSoon: false,
      active: true,
      linkedAt: now.toLocaleString(),
      autoRefresh: true,
      refreshing: false
    };
    // Enviar al backend para almacenar en MongoDB (nombre, fecha, estado)
    try {
      await fetch(`${BACKEND_URL}/api/instagram-token/simulate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          username,
          linkedAt: now.toISOString(),
          active: true
        })
      });
    } catch (e) {
      // Si falla, solo simula en frontend
    }
    setTimeout(() => {
      setAccounts(accs => [fakeAccount, ...accs]);
      setLinking(false);
      setToast({ open: true, message: 'Cuenta vinculada exitosamente (simulada)', type: 'success' });
    }, 1000);
  };

  // Desvincular cuenta
  const handleUnlink = async (id) => {
    setLoading(true);
    try {
      // Eliminar solo la cuenta específica por su _id en la BD
      await fetch(`${BACKEND_URL}/api/instagram-token/simulate-link/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setToast({ open: true, message: 'Cuenta desvinculada', type: 'success' });
      fetchAccounts();
    } catch (e) {
      setToast({ open: true, message: 'Error al desvincular', type: 'error' });
    }
    setLoading(false);
    setConfirm({ open: false, id: null });
  };

  // Refrescar token (simulado: solo restablece el contador de tiempo para expirar)
  const handleRefresh = async (id) => {
    setAccounts(accs => accs.map(a =>
      a._id === id
        ? {
            ...a,
            refreshing: true,
            timeToExpire: '59d 23h',
            isExpiringSoon: false
          }
        : a
    ));
    setTimeout(() => {
      setAccounts(accs => accs.map(a => a._id === id ? { ...a, refreshing: false } : a));
      setToast({ open: true, message: 'Token renovado (simulado)', type: 'success' });
    }, 1000);
  };

  // Alternar estado activa/desactivada
  const handleToggleActive = (id, value) => {
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, active: value } : a));
    setToast({ open: true, message: value ? 'Cuenta activada' : 'Cuenta desactivada', type: value ? 'success' : 'warning' });
  };

  // Cambiar auto-refresh
  const handleToggleAutoRefresh = async (id, value) => {
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, autoRefresh: value } : a));
    // Aquí deberías guardar el valor en el backend si lo soporta
    setToast({ open: true, message: value ? 'Auto-refresh activado' : 'Auto-refresh desactivado', type: value ? 'success' : 'warning' });
  };

  // Filtrar cuentas por nombre
  const filteredAccounts = accounts.filter(acc => acc.username.toLowerCase().includes(search.toLowerCase()));

  return (
  <div style={{ width: '100vw', minHeight: '100vh', maxWidth: '100%', margin: '0 auto', padding: 24, overflow: 'visible' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <InstagramLinkCard
          isLinked={false} // Siempre mostrar el botón de vincular
          onLink={handleLink}
          onUnlink={() => setConfirm({ open: true, id: user?._id })}
          instagramUser={accounts[0]}
          loading={linking || loading}
        />
      </div>
      <InstagramAccountsTable
        accounts={filteredAccounts.map(acc => ({
          ...acc,
          onToggleActive: handleToggleActive
        }))}
        onUnlink={id => setConfirm({ open: true, id })}
        onRefresh={handleRefresh}
        onToggleAutoRefresh={handleToggleAutoRefresh}
        search={search}
        setSearch={setSearch}
      />
      <ConfirmModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => handleUnlink(confirm.id)}
        message="¿Estás seguro que deseas desvincular esta cuenta?"
      />
      {toast.open && toast.message && (
        <Toast
          open={toast.open}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, open: false })}
          duration={3000}
        />
      )}
    </div>
  );
};

export default CuentasPanel;
