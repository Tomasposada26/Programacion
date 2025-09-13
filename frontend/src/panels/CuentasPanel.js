import React, { useEffect, useState } from 'react';
import InstagramLinkCard from '../components/InstagramLinkCard';
import InstagramAccountsTable from '../components/InstagramAccountsTable';
import ConfirmModal from '../components/ConfirmModal';
import '../components/InstagramAccountsTable.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';


// Ahora recibimos user y token desde props (App.js)
const CuentasPanel = ({ accounts, setAccounts, user, setNotifications, setNotificationCount, notifications, accountNotifications, setAccountNotifications }) => {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [search, setSearch] = useState('');
  const [linking, setLinking] = useState(false);

  // --- Expiración y auto-refresh ---
  // Cada cuenta tendrá: expiresAt (timestamp), autoRefresh (bool), active (bool)
  // Al montar, si no tiene expiresAt, se le asigna 1 hora desde ahora
  useEffect(() => {
    setAccounts(accs => accs.map(acc => {
      if (!acc.expiresAt) {
        return { ...acc, expiresAt: Date.now() + 60 * 60 * 1000 };
      }
      return acc;
    }));
  }, []);

  // Intervalo global para actualizar los contadores cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setAccounts(accs => accs.map(acc => {
        if (!acc.expiresAt) return acc;
        const msLeft = acc.expiresAt - Date.now();
        // Si ya expiró
        if (msLeft <= 0) {
          if (acc.autoRefresh) {
            // Si auto-refresh, renovar automáticamente
            return { ...acc, expiresAt: Date.now() + 60 * 60 * 1000, isExpiringSoon: false, active: true };
          } else if (acc.active) {
            // Si no auto-refresh, desactivar
            return { ...acc, active: false, isExpiringSoon: false };
          }
        } else if (msLeft <= 5 * 60 * 1000 && acc.autoRefresh && acc.active) {
          // Si quedan 5 min y auto-refresh, renovar automáticamente
          return { ...acc, expiresAt: Date.now() + 60 * 60 * 1000, isExpiringSoon: false, active: true };
        } else if (msLeft <= 5 * 60 * 1000 && acc.active) {
          // Marcar como pronto a expirar
          return { ...acc, isExpiringSoon: true };
        } else if (acc.isExpiringSoon) {
          // Quitar flag si ya no está pronto a expirar
          return { ...acc, isExpiringSoon: false };
        }
        return acc;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [setAccounts]);

  // Obtener cuentas vinculadas solo si no hay en el estado global y el token es válido
  const fetchAccounts = async () => {
    if (!user || !user.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/instagram-token/user-accounts`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.map(acc => {
          // Si no tiene expiresAt, asígnale uno y persiste en backend
          let expiresAt = acc.expiresAt;
          if (!expiresAt) {
            expiresAt = Date.now() + 60 * 60 * 1000;
            // Persistir en backend
            fetch(`${BACKEND_URL}/api/instagram-token/update-expiry/${acc._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({ expiresAt })
            });
          }
          return {
            ...acc,
            _id: acc._id,
            username: acc.username,
            profile_picture_url: 'https://ui-avatars.com/api/?name=IG',
            isExpiringSoon: false,
            active: acc.active,
            linkedAt: acc.linkedAt ? new Date(acc.linkedAt).toLocaleString() : 'N/A',
            autoRefresh: acc.autoRefresh !== undefined ? acc.autoRefresh : true,
            refreshing: false,
            expiresAt
          };
        }));
      } else {
        // No borres el estado global si falla el fetch
        // Opcional: muestra un error si quieres
        // setAccounts([]);
      }
    } catch (e) {
      // No borres el estado global si falla el fetch
    }
    setLoading(false);
  };

  useEffect(() => {
    // Solo hace fetch si no hay cuentas en el estado global
    if ((!accounts || accounts.length === 0) && user && user.token) {
      fetchAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Formatear tiempo para expirar (mm:ss)
  function formatTimeToExpire(expiresAt) {
    if (!expiresAt) return 'N/A';
    const ms = expiresAt - Date.now();
    if (ms <= 0) return 'Expirado';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  }

  // Vincular cuenta (simulación: abre popup de Instagram OAuth)
  const handleLink = async () => {
    setLinking(true);
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
    const expiresAt = Date.now() + 60 * 60 * 1000;
    const fakeAccount = {
      _id: Math.random().toString(36).slice(2),
      username,
      profile_picture_url: 'https://ui-avatars.com/api/?name=IG',
      isExpiringSoon: false,
      active: true,
      linkedAt: now.toLocaleString(),
      autoRefresh: true,
      refreshing: false,
      expiresAt
    };
    // Guardar expiresAt en backend al vincular
    try {
      await fetch(`${BACKEND_URL}/api/instagram-token/simulate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          username,
          linkedAt: now.toISOString(),
          active: true,
          expiresAt
        })
      });
    } catch (e) {}
    setTimeout(() => {
      setAccounts(accs => [fakeAccount, ...accs]);
      // Notificación: cuenta vinculada (solo en accountNotifications)
      if (setAccountNotifications) {
        const notif = {
          id: Date.now() + Math.random(),
          text: `Cuenta ${username} vinculada exitosamente`,
          date: new Date().toISOString(),
          type: 'vinculada',
          accountId: fakeAccount._id || '',
        };
        setAccountNotifications([notif, ...(accountNotifications || [])]);
      }
      setLinking(false);
    }, 1000);
  };

  // Desvincular cuenta
  const handleUnlink = async (id) => {
    // Eliminación optimista: elimina la cuenta del estado inmediatamente
    setAccounts(accs => accs.filter(a => a._id !== id));
    // Notificación: cuenta desvinculada
    if (setAccountNotifications) {
      const notif = {
        id: Date.now() + Math.random(),
        text: `Cuenta desvinculada exitosamente`,
        date: new Date().toISOString(),
        type: 'eliminada',
        accountId: id || '',
      };
      setAccountNotifications([notif, ...(accountNotifications || [])]);
    }
    setConfirm({ open: false, id: null });
    setLoading(true);
    try {
      // Eliminar solo la cuenta específica por su _id en la BD
      await fetch(`${BACKEND_URL}/api/instagram-token/simulate-link/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
    } catch (e) {
      // Si falla, podrías mostrar un toast y recargar cuentas
      // setToast({ open: true, message: 'Error al desvincular', type: 'error' });
      fetchAccounts();
    }
    setLoading(false);
  };

  // Refrescar token manualmente: reinicia el contador a 1 hora
  const handleRefresh = async (id) => {
    setAccounts(accs => accs.map(a =>
      a._id === id
        ? {
            ...a,
            refreshing: true,
            expiresAt: Date.now() + 60 * 60 * 1000,
            isExpiringSoon: false,
            active: true
          }
        : a
    ));
    setTimeout(() => {
      setAccounts(accs => accs.map(a => a._id === id ? { ...a, refreshing: false } : a));
    }, 1000);
  };

  // Alternar estado activa/desactivada
  const handleToggleActive = (id, value) => {
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, active: value } : a));
    // Notificación: cuenta desactivada o reactivada
    if (setAccountNotifications) {
      const notif = {
        id: Date.now() + Math.random(),
        text: value ? `Cuenta activada` : `Cuenta desactivada`,
        date: new Date().toISOString(),
        type: value ? 'activada' : 'desactivada',
        accountId: id || '',
      };
      setAccountNotifications([notif, ...(accountNotifications || [])]);
    }
  };

  // Cambiar auto-refresh
  const handleToggleAutoRefresh = async (id, value) => {
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, autoRefresh: value } : a));
    // Aquí deberías guardar el valor en el backend si lo soporta
    // setToast({ open: true, message: value ? 'Auto-refresh activado' : 'Auto-refresh desactivado', type: value ? 'success' : 'warning' });
  };

  // Filtrar cuentas por nombre
  const filteredAccounts = accounts.filter(acc => acc.username.toLowerCase().includes(search.toLowerCase()));

  return (
  <div style={{ width: '100vw', minHeight: '100vh', maxWidth: '100%', margin: '0 auto', padding: 24, overflow: 'visible', marginLeft: '-20ch' }}>
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
          timeToExpire: formatTimeToExpire(acc.expiresAt),
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
    </div>
  );
};

export default CuentasPanel;
