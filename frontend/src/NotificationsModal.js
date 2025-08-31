import React from 'react';
import './NotificationsModal.css';
import { useTranslation } from 'react-i18next';

const NotificationsModal = ({ open, onClose, notifications = [], setNotifications, setNotificationCount }) => {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="notifications-modal-overlay" onClick={onClose}>
      <div style={{position:'relative', width:'100%', height:0}}>
        <div className="notifications-modal" onClick={e => e.stopPropagation()}>
          <div className="notifications-pointer" />
          <div className="notifications-content">
            {notifications.length === 0 ? (
              <span className="notifications-empty">{t('notifications.empty')}</span>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 260, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <li key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7fa', borderRadius: 7, marginBottom: 8, padding: '10px 14px', boxShadow: '0 1px 4px #0001' }}>
                    <span style={{ fontWeight: 500, color: '#222' }}>{n.text}</span>
                    <span style={{ fontSize: 12, color: '#888', marginLeft: 12 }}>{n.date}</span>
                    <button
                      style={{ marginLeft: 16, background: 'none', border: 'none', color: '#e53e3e', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                      title={t('notifications.delete')}
                      onClick={() => {
                        const filtered = notifications.filter(x => x.id !== n.id);
                        setNotifications(filtered);
                        setNotificationCount(filtered.length);
                      }}
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
