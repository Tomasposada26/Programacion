import React from 'react';
import '../styles/BellDropdownModal.css';

const BellDropdownModal = ({ open, anchorRef, notifications = [], setNotifications, setNotificationCount }) => {
  if (!open || !anchorRef) return null;
  // Get anchor position
  const rect = anchorRef.current?.getBoundingClientRect();
  const style = rect ? {
    position: 'fixed',
    top: rect.top - 24, // sube el modal más arriba
    left: rect.right + 18,
    minWidth: 380,
    maxWidth: 540,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
    zIndex: 20000,
    padding: 0,
    overflow: 'visible',
  } : { display: 'none' };

  return (
    <div style={style} className="bell-dropdown-modal" onClick={e => e.stopPropagation()}>
      <div className="bell-dropdown-content">
        {notifications.length === 0 ? (
          <span className="bell-dropdown-empty">No tienes notificaciones</span>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 260, overflowY: 'auto' }}>
            {notifications.map(n => (
              <li key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7fa', borderRadius: 7, marginBottom: 8, padding: '10px 14px', boxShadow: '0 1px 4px #0001' }}>
                <span style={{ fontWeight: 500, color: '#222', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {n.text}
                </span>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 18, marginRight: 8, minWidth: 120, textAlign: 'right', flexShrink: 0 }}>
                  {(() => {
                    if (n.date && n.date.includes('T')) {
                      const [fecha, horaRaw] = n.date.replace('Z','').split('T');
                      const hora = horaRaw ? horaRaw.slice(0,8) : '';
                      return `${fecha} ${hora}`;
                    }
                    return n.date;
                  })()}
                </span>
                <button
                  style={{ marginLeft: 6, background: 'none', border: 'none', color: '#e53e3e', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                  title="Eliminar notificación"
                  onClick={e => {
                    e.stopPropagation();
                    const filtered = notifications.filter(x => x.id !== n.id);
                    setNotifications(filtered);
                  }}
                >✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BellDropdownModal;
