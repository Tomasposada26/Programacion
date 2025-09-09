import React, { useEffect, useState } from 'react';
import InstagramLinkCard from '../components/InstagramLinkCard';
import InstagramAccountsTable from '../components/InstagramAccountsTable';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import '../components/InstagramAccountsTable.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';

const CuentasPanel = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [search, setSearch] = useState('');
  const [linking, setLinking] = useState(false);
  const [user, setUser] = useState(null); // Aquí deberías obtener el usuario logueado (JWT)

  // Simulación: obtener usuario logueado (reemplaza por tu lógica real)
  useEffect(() => {
    // Aquí deberías obtener el usuario logueado y su JWT
    setUser({ _id: '68ba567c7d8776eaa6286717', username: 'Tomas0626', token: localStorage.getItem('token') });
  }, []);

  // Obtener cuentas vinculadas
  const fetchAccounts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/instagram-token/get-token/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Si el backend soporta múltiples cuentas, data debe ser array. Si no, adaptamos:
        const arr = Array.isArray(data) ? data : data && data.access_token ? [data] : [];
        setAccounts(arr.map(acc => ({
          ...acc,
          _id: acc._id || user._id,
          username: acc.instagram_user_id || 'Desconocido',
          profile_picture_url: acc.profile_picture_url || 'https://ui-avatars.com/api/?name=IG',
          timeToExpire: acc.expires_in ? formatTimeToExpire(acc.expires_in, acc.last_refresh) : 'N/A',
          isExpiringSoon: acc.expires_in && acc.expires_in < 3 * 24 * 3600, // menos de 3 días
          active: !!acc.access_token,
          linkedAt: acc.last_refresh ? new Date(acc.last_refresh).toLocaleString() : 'N/A',
          autoRefresh: acc.autoRefresh !== false,
          refreshing: false
        })));
      } else {
        setAccounts([]);
      }
    } catch (e) {
      setAccounts([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAccounts(); }, [user]);

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
    // Aquí deberías abrir el flujo real de Instagram OAuth en un modal
    setTimeout(() => {
      setLinking(false);
      setToast({ open: true, message: 'Cuenta vinculada exitosamente', type: 'success' });
      fetchAccounts();
    }, 2000);
  };

  // Desvincular cuenta
  const handleUnlink = async (id) => {
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/api/instagram-token/delete-by-user/${user._id}`, {
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

  // Refrescar token
  const handleRefresh = async (id) => {
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, refreshing: true } : a));
    try {
      await fetch(`${BACKEND_URL}/api/instagram-token/refresh-token/${user._id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setToast({ open: true, message: 'Token renovado', type: 'success' });
      fetchAccounts();
    } catch (e) {
      setToast({ open: true, message: 'Error al renovar token', type: 'error' });
    }
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, refreshing: false } : a));
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
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <InstagramLinkCard
          isLinked={accounts.length > 0}
          onLink={handleLink}
          onUnlink={() => setConfirm({ open: true, id: user._id })}
          instagramUser={accounts[0]}
          loading={linking || loading}
        />
      </div>
      <InstagramAccountsTable
        accounts={filteredAccounts}
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
        />
      )}
    </div>
  );
};

export default CuentasPanel;
