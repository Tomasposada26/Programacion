import React from 'react';
import './InstagramAccountsTable.css';

// Formatea fecha a 'YYYY-MM-DD HH:mm:ss'
function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const pad = n => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const InstagramAccountsTable = ({ accounts, onUnlink, onRefresh, onToggleAutoRefresh, search, setSearch }) => (
  <div style={{ width: '100%', maxWidth: 1200, margin: '32px auto 0 auto' }}>
    
    {/* Barra de búsqueda */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <input
        type="text"
        placeholder="Buscar por nombre de perfil..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: 8, borderRadius: 8, border: '1px solid #cfd8dc', width: 260 }}
        aria-label="Buscar por nombre de perfil"
      />
    </div>

    {/* Tabla de cuentas */}
    <div
      className="instagram-accounts-table-wrapper"
      style={{
        maxHeight: 400,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: 12,
        boxShadow: '0 2px 8px #cfd8dc22',
        width: '100%',
        minWidth: 900
      }}
    >
      <table className="instagram-accounts-table" style={{ width: '100%', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>Nombre de perfil</th>
            <th>Tiempo para expirar</th>
            <th style={{ width: 120 }}>Estado</th>
            <th>Fecha de vinculación</th>
            <th>Auto-refresh</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                No hay cuentas vinculadas
              </td>
            </tr>
          ) : (
            accounts.map(acc => (
              <tr key={acc._id} className={acc.isExpiringSoon ? 'expiring' : ''}>
                
                {/* Nombre de perfil con tooltip */}
                <td>
                  <span
                    tabIndex={0}
                    className="profile-tooltip-trigger"
                    aria-describedby={`tooltip-${acc._id}`}
                  >
                    {acc.username}
                    <span className="profile-tooltip" id={`tooltip-${acc._id}`} role="tooltip">
                      <img
                        src={acc.profile_picture_url}
                        alt={`Foto de perfil de ${acc.username}`}
                        width={64}
                        height={64}
                      />
                    </span>
                  </span>
                </td>

                {/* Tiempo para expirar */}
                <td>
                  <span className={acc.isExpiringSoon ? 'badge badge-warning' : 'badge badge-ok'}>
                    {acc.timeToExpire}
                  </span>
                </td>

                {/* Estado con toggle */}
                <td style={{ width: 120, textAlign: 'center' }}>
                  <span
                    className={acc.active ? 'badge badge-ok' : 'badge badge-off'}
                    style={{ cursor: 'pointer', minWidth: 70, display: 'inline-block' }}
                    title="Haz clic para activar/desactivar"
                    onClick={() => acc.onToggleActive && acc.onToggleActive(acc._id, !acc.active)}
                  >
                    {acc.active ? 'Activa' : 'Desactivada'}
                  </span>
                </td>

                {/* Fecha de vinculación */}
                <td>{formatDate(acc.linkedAt)}</td>

                {/* Auto-refresh */}
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={acc.autoRefresh}
                      onChange={() => onToggleAutoRefresh(acc._id, !acc.autoRefresh)}
                      aria-checked={acc.autoRefresh}
                      aria-label={`Auto-refresh para ${acc.username}`}
                    />
                    <span className="slider round"></span>
                  </label>
                  {!acc.autoRefresh && (
                    <div className="warning-text">Si el token expira, el sistema puede fallar.</div>
                  )}
                </td>

                {/* Acciones */}
                <td style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn-refresh"
                    onClick={() => onRefresh(acc._id)}
                    disabled={acc.refreshing}
                  >
                    {acc.refreshing ? 'Renovando...' : 'Renovar token'}
                  </button>
                  <button className="btn-unlink" onClick={() => onUnlink(acc._id)}>
                    Desvincular
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default InstagramAccountsTable;
