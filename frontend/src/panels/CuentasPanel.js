import React, { useEffect, useState } from 'react';
import InstagramLinkCard from '../components/InstagramLinkCard';
import InstagramAccountsTable from '../components/InstagramAccountsTable';
import ConfirmModal from '../components/ConfirmModal';
import '../components/InstagramAccountsTable.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';

// Ahora recibimos user y token desde props (App.js)
const CuentasPanel = ({ accounts, setAccounts, user, setGlobalNotifications, globalNotifications }) => {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [search, setSearch] = useState('');
  const [linking, setLinking] = useState(false);

  // --- Expiración y auto-refresh ---
  useEffect(() => {
    setAccounts(accs => accs.map(acc => {
      if (!acc.expiresAt) {
        return { ...acc, expiresAt: Date.now() + 60 * 60 * 1000 };
      }
      return acc;
    }));
  }, [setAccounts]);

  // Intervalo global para actualizar los contadores cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setAccounts(accs => accs.map(acc => {
        if (!acc.expiresAt) return acc;
        const msLeft = acc.expiresAt - Date.now();

        if (msLeft <= 0) {
          if (acc.autoRefresh) {
            return { ...acc, expiresAt: Date.now() + 60 * 60 * 1000, isExpiringSoon: false, active: true };
          } else if (acc.active) {
            return { ...acc, active: false, isExpiringSoon: false };
          }
        } else if (msLeft <= 5 * 60 * 1000 && acc.autoRefresh && acc.active) {
          return { ...acc, expiresAt: Date.now() + 60 * 60 * 1000, isExpiringSoon: false, active: true };
        } else if (msLeft <= 5 * 60 * 1000 && acc.active) {
          return { ...acc, isExpiringSoon: true };
        } else if (acc.isExpiringSoon) {
          return { ...acc, isExpiringSoon: false };
        }
        return acc;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [setAccounts]);

  // Obtener cuentas vinculadas
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
          let expiresAt = acc.expiresAt;
          if (!expiresAt) {
            expiresAt = Date.now() + 60 * 60 * 1000;
            fetch(`${BACKEND_URL}/api/instagram-token/update-expiry/${acc._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({ expiresAt })
            });
          }
          let autoRefresh = true;
          if (typeof acc.autoRefresh === 'boolean') autoRefresh = acc.autoRefresh;
          return {
            ...acc,
            _id: acc._id,
            username: acc.username,
            profile_picture_url: 'https://ui-avatars.com/api/?name=IG',
            isExpiringSoon: false,
            active: acc.active,
            linkedAt: acc.linkedAt ? new Date(acc.linkedAt).toLocaleString() : 'N/A',
            autoRefresh,
            refreshing: false,
            expiresAt
          };
        }));
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    if ((!accounts || accounts.length === 0) && user && user.token) {
      fetchAccounts();
    }
  }, [user, accounts, fetchAccounts]);

  // Formatear tiempo
  function formatTimeToExpire(expiresAt) {
    if (!expiresAt) return 'N/A';
    const ms = expiresAt - Date.now();
    if (ms <= 0) return 'Expirado';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  }

  // Vincular cuenta (simulada)
  const handleLink = async () => {
    setLinking(true);
    const now = new Date();
    const realNames = [
      'sofia.gomez', 'juanpablo_23', 'cata.martinez', 'luisfer.photo', 'valen_fit',
      'andres.music', 'camila.makeup', 'dani_travels', 'maria.foodie', 'joseblog',
      'laura.art', 'mateo.tech', 'isa_runner', 'nico.gamer', 'caro.style',
      'pablo_chef', 'martina.books', 'santi.surf', 'alejandra.yoga', 'felipe.coffee'
    ];
    const username = `@${realNames[Math.floor(Math.random() * realNames.length)]}`;
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

    try {
      const res = await fetch(`${BACKEND_URL}/api/instagram-token/simulate-link`, {
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
      if (res.ok) {
        const saved = await res.json();
        setAccounts(accs => [
          {
            ...fakeAccount,
            _id: saved._id || fakeAccount._id // usa el id real si lo devuelve el backend
          },
          ...accs
        ]);
        if (setGlobalNotifications) {
          const notif = {
            id: Date.now() + Math.random(),
            text: `Cuenta ${username} vinculada exitosamente`,
            date: new Date().toISOString(),
            type: 'vinculada',
            accountId: saved._id || fakeAccount._id || '',
            _tipo: 'cuenta'
          };
          setGlobalNotifications(prev => [notif, ...(prev || [])]);
        }
      }
    } catch (e) {
      // opcional: mostrar error
    }
    setLinking(false);
  };

  // Desvincular cuenta
  const handleUnlink = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/instagram-token/simulate-link/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const acc = accounts.find(a => a._id === id);
        const username = acc ? acc.username : '';
        setAccounts(accs => accs.filter(a => a._id !== id));
        if (setGlobalNotifications) {
          const notif = {
            id: Date.now() + Math.random(),
            text: `Cuenta ${username} desvinculada exitosamente`,
            date: new Date().toISOString(),
            type: 'eliminada',
            accountId: id || '',
            _tipo: 'cuenta'
          };
          setGlobalNotifications(prev => [notif, ...(prev || [])]);
        }
      }
    } catch (e) {
      fetchAccounts();
    }
    setConfirm({ open: false, id: null });
    setLoading(false);
  };

  // Refrescar token
  const handleRefresh = async (id) => {
    setAccounts(accs => accs.map(a =>
      a._id === id
        ? { ...a, refreshing: true, expiresAt: Date.now() + 60 * 60 * 1000, isExpiringSoon: false, active: true }
        : a
    ));
    setTimeout(() => {
      setAccounts(accs => accs.map(a => a._id === id ? { ...a, refreshing: false } : a));
    }, 1000);
  };

  // Activar / desactivar
  const handleToggleActive = (id, value) => {
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, active: value } : a));
    if (setGlobalNotifications) {
      const notif = {
        id: Date.now() + Math.random(),
        text: value ? `Cuenta activada` : `Cuenta desactivada`,
        date: new Date().toISOString(),
        type: value ? 'activada' : 'desactivada',
        accountId: id || '',
        _tipo: 'cuenta'
      };
      setGlobalNotifications(prev => [notif, ...(prev || [])]);
    }
  };

  // Auto-refresh
  const handleToggleAutoRefresh = (id, value) => {
    setAccounts(accs => accs.map(a => a._id === id ? { ...a, autoRefresh: value } : a));
  };

  // Filtrar
  const filteredAccounts = accounts.filter(acc => acc.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ width: '100vw', minHeight: '100vh', maxWidth: '100%', margin: '0 auto', padding: 24, overflow: 'visible', marginLeft: '-20ch' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <InstagramLinkCard
          onLink={async () => {
            if (linking) return;
            setLinking(true);
            const now = new Date();
            const realNames = [
              'sofia.gomez', 'juanpablo_23', 'cata.martinez', 'luisfer.photo', 'valen_fit',
              'andres.music', 'camila.makeup', 'dani_travels', 'maria.foodie', 'joseblog',
              'laura.art', 'mateo.tech', 'isa_runner', 'nico.gamer', 'caro.style',
              'pablo_chef', 'martina.books', 'santi.surf', 'alejandra.yoga', 'felipe.coffee'
            ];
            const username = `@${realNames[Math.floor(Math.random() * realNames.length)]}`;
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
            try {
              const res = await fetch(`${BACKEND_URL}/api/instagram-token/simulate-link`, {
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
              if (res.ok) {
                const saved = await res.json();
                setAccounts(accs => [
                  {
                    ...fakeAccount,
                    _id: saved._id || fakeAccount._id
                  },
                  ...accs
                ]);
                if (setGlobalNotifications) {
                  const notif = {
                    id: Date.now() + Math.random(),
                    text: `Cuenta ${username} vinculada exitosamente`,
                    date: new Date().toISOString(),
                    type: 'vinculada',
                    accountId: saved._id || fakeAccount._id || '',
                    _tipo: 'cuenta'
                  };
                  setGlobalNotifications(prev => [notif, ...(prev || [])]);
                }
              }
            } catch (e) {
              // opcional: mostrar error
            }
            setLinking(false);
          }}
          loading={linking}
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
        onConfirm={() => {
          // Eliminar inmediatamente del frontend
          setAccounts(accs => accs.filter(a => a._id !== confirm.id));
          handleUnlink(confirm.id);
        }}
        message="¿Estás seguro que deseas desvincular esta cuenta?"
      />
    </div>
  );
};

export default CuentasPanel;
