import React, { useState, useEffect } from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';

const RespuestasPanel = () => {
  const { t } = useTranslation();
  // Acceso a notificaciones globales si están en window (App.js las expone en window.setNotifications, etc.)
  const setNotifications = window.setNotifications;
  const setNotificationCount = window.setNotificationCount;
  // Estado para el formulario
  const [form, setForm] = useState({
    trigger: '',
    type: '',
    categories: [],
    advanced: '',
    response: '',
    notes: '',
    state: true
  });
  // Estado para las reglas
  const [reglas, setReglas] = useState([]);
  // Estado para edición
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  // Cargar reglas al montar
  useEffect(() => {
  fetch('https://aura-0244.onrender.com/api/reglas')
      .then(res => res.json())
      .then(data => setReglas(Array.isArray(data) ? data : []));
  }, []);
  // Manejar cambios en el formulario
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'categories') {
      setForm(f => {
        let cats = f.categories;
        if (checked) cats = [...cats, value];
        else cats = cats.filter(c => c !== value);
        return { ...f, categories: cats };
      });
    } else if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  // Guardar regla
  const handleSubmit = async e => {
    e.preventDefault();
    const nueva = {
      tipoInteraccion: form.trigger,
      type: form.type,
      categorias: form.categories,
      respuestaAutomatica: form.response,
      notasInternas: form.notes,
      estado: form.state ? 'activa' : 'inactiva'
    };
    try {
  const res = await fetch('https://aura-0244.onrender.com/api/reglas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva)
      });
      if (res.ok) {
        const reglaCreada = await res.json();
        setReglas(rs => [reglaCreada, ...rs]);
        setForm({ trigger: '', type: '', categories: [], advanced: '', response: '', notes: '', state: true });
        // Notificación en campanita
        if (typeof setNotifications === 'function' && typeof setNotificationCount === 'function') {
          setNotifications(prev => {
            const noti = {
              id: Date.now(),
              text: t('notifications.ruleAdded', 'Nueva regla creada'),
              date: new Date().toISOString()
            };
            const newArr = [noti, ...(Array.isArray(prev) ? prev : [])];
            setNotificationCount(newArr.length);
            return newArr;
          });
        }
      } else {
        alert('Error al guardar la regla');
      }
    } catch {
      alert('Error de red');
    }
  };
  // Suponiendo que la barra superior tiene 100px de alto (como en App.js)
  // Permitir editar tamaño de la card con props o variables (ejemplo: width, height, padding)
  // Usar darkMode si está disponible en contexto o props
  const darkMode = document.body.classList.contains('aura-dark') || document.documentElement.classList.contains('aura-dark');
  const cardStyles = {
    background: darkMode ? '#2d323b' : '#f8faff',
    color: darkMode ? '#fff' : '#232a3b',
    borderRadius: 0,
    position: 'fixed',
    top: 100, // altura de la barra superior
    left: 320, // ancho de la barra lateral
    right: 0,
    bottom: 0,
    width: 'auto',
    height: 'auto',
    boxShadow: darkMode ? '0 4px 24px #10b98144' : '0 4px 24px #10b98122',
    fontWeight: 400,
    fontSize: 16,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: '38px 38px 32px 38px',
    gap: 32,
    transition: 'background 0.3s, color 0.3s',
    overflowY: 'auto',
    overflowX: 'auto',
    zIndex: 1
  };
  return (
    <div className="respuestas-panel aura-main-panel-bg">
      <div style={cardStyles}>
        <h2 style={{fontWeight:800, fontSize: '1.6rem', marginBottom: 18}}>{t('autoResponses.title', 'Respuestas Automáticas')}</h2>
        {/* Formulario para añadir nueva regla */}
  <form style={{
          background: darkMode ? '#181c24' : '#fff',
          color: darkMode ? '#fff' : '#232a3b',
          borderRadius:12,
          padding:'28px 28px 18px 28px',
          boxShadow:'0 2px 8px #0001',
          marginBottom:18,
          display:'flex',
          flexDirection:'column',
          gap:18,
          transition:'background 0.3s, color 0.3s'
  }} onSubmit={handleSubmit}>
          <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>{t('autoResponses.addNew','Añadir Nueva Regla')}</div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:220}}>
              <label style={{fontWeight:600}}>{t('autoResponses.trigger','Disparador:')}</label><br/>
              <select name="trigger" value={form.trigger} onChange={handleChange} required style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}}>
                <option value="">{t('autoResponses.select','Select...')}</option>
                <option value="like">{t('autoResponses.like','Me gusta')}</option>
                <option value="comment">{t('autoResponses.comment','Comentario')}</option>
                <option value="share">{t('autoResponses.share','Compartido')}</option>
              </select>
            </div>
            <div style={{flex:1,minWidth:220}}>
              <label style={{fontWeight:600}}>{t('autoResponses.type','Tipo de Publicación:')}</label><br/>
              <select name="type" value={form.type} onChange={handleChange} required style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}}>
                <option value="">{t('autoResponses.select','Select...')}</option>
                <option value="post">{t('autoResponses.post','Publicación')}</option>
                <option value="reel">{t('autoResponses.reel','Reel')}</option>
                <option value="story">{t('autoResponses.story','Historia')}</option>
              </select>
            </div>
            <div style={{flex:2,minWidth:260}}>
              <label style={{fontWeight:600}}>{t('autoResponses.categories','Categorías a Escuchar:')}</label><br/>
              <div style={{display:'flex',gap:18,marginTop:4}}>
                {/* Checkbox 'Todos' eliminado */}
                <label><input type="checkbox" name="categories" value="vacantes" checked={form.categories.includes('vacantes')} onChange={handleChange}/> {t('autoResponses.vacancyCategory','Vacantes')}</label>
                <label><input type="checkbox" name="categories" value="eventos" checked={form.categories.includes('eventos')} onChange={handleChange}/> {t('autoResponses.eventCategory','Eventos')}</label>
                <label><input type="checkbox" name="categories" value="reuniones" checked={form.categories.includes('reuniones')} onChange={handleChange}/> {t('autoResponses.meetingCategory','Reuniones')}</label>
              </div>
            </div>
          </div>
          <div>
            <label style={{fontWeight:600}}>{t('autoResponses.advanced','Condiciones Avanzadas (opcional):')}</label><br/>
            <input type="text" name="advanced" value={form.advanced} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}} placeholder={t('autoResponses.advancedPlaceholder','Palabras clave, horario, usuario específico...')}/>
          </div>
          <div>
            <label style={{fontWeight:600}}>{t('autoResponses.response','Mensaje de Respuesta:')}</label><br/>
            <textarea name="response" value={form.response} onChange={handleChange} required style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4,minHeight:60}} placeholder={t('autoResponses.responsePlaceholder','Mensaje que enviará el bot. Puedes usar {nombre_usuario}, {link}, etc.')}/>
          </div>
          <div>
            <label style={{fontWeight:600}}>{t('autoResponses.notes','Descripción/Notas internas (opcional):')}</label><br/>
            <input type="text" name="notes" value={form.notes} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}} placeholder={t('autoResponses.notesPlaceholder','Solo visible para administradores')}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:18}}>
            <label style={{fontWeight:600}}>{t('autoResponses.state','Estado:')}</label>
            <input type="checkbox" name="state" checked={form.state} onChange={handleChange} style={{marginRight:6}}/> {t('autoResponses.active','Activo')}
          </div>
          <div style={{display:'flex',gap:12,marginTop:8}}>
            <button type="submit" style={{background:'#188fd9',color:'#fff',fontWeight:700,padding:'10px 28px',border:'none',borderRadius:8,fontSize:16,cursor:'pointer',boxShadow:'0 2px 8px #188fd922'}}>{t('autoResponses.save','Guardar Regla')}</button>
            <button type="button" style={{background:'#fff',color:'#888',fontWeight:600,padding:'10px 18px',border:'1px solid #ccc',borderRadius:8,fontSize:16,cursor:'pointer'}}>{t('autoResponses.cancel','Cancelar')}</button>
          </div>
        </form>
        {/* Tabla de reglas automáticas */}
  <div style={{
          background: darkMode ? '#181c24' : '#fff',
          color: darkMode ? '#fff' : '#232a3b',
          borderRadius:12,
          padding:'18px 18px 8px 18px',
          boxShadow:'0 2px 8px #0001',
          transition:'background 0.3s, color 0.3s'
        }}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div>
              <button style={{marginRight:8,background:'#e0e7ef',color:'#232a3b',fontWeight:600,padding:'6px 16px',border:'none',borderRadius:6,cursor:'pointer'}}>{t('autoResponses.export','Exportar JSON')}</button>
              <button style={{background:'#e0e7ef',color:'#232a3b',fontWeight:600,padding:'6px 16px',border:'none',borderRadius:6,cursor:'pointer'}}>{t('autoResponses.import','Importar JSON')}</button>
            </div>
          </div>
          <table style={{
            width:'100%',
            borderCollapse:'collapse',
            fontSize:15,
            background: darkMode ? '#181c24' : '#fff',
            color: darkMode ? '#fff' : '#232a3b',
            transition:'background 0.3s, color 0.3s'
          }}>
            <thead>
              <tr style={{background: darkMode ? '#232a3b' : '#f4f6fb',fontWeight:700,color: darkMode ? '#fff' : '#232a3b'}}>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '90px', width: '90px', whiteSpace: 'normal'}}>{t('autoResponses.trigger','Disparador')}</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '120px', width: '120px', whiteSpace: 'normal'}}>{t('autoResponses.type','Tipo')}</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '220px', width: '220px', whiteSpace: 'normal'}}>{t('autoResponses.categories','Categorías')}</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0'}}>{t('autoResponses.state','Estado')}</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '560px', width: '560px', whiteSpace: 'normal'}}>{t('autoResponses.response','Respuesta')}</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0'}}>{t('autoResponses.actions','Acciones')}</th>
              </tr>
            </thead>
            <tbody style={{background: darkMode ? '#181c24' : '#fff', color: darkMode ? '#fff' : '#232a3b'}}>
              {reglas.map(regla => (
                <tr key={regla._id}>
                  <td style={{padding:'8px 6px', maxWidth: '90px', width: '90px', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{t(`autoResponses.${regla.tipoInteraccion}`,(regla.tipoInteraccion||'-'))}</td>
                  <td style={{padding:'8px 6px', maxWidth: '120px', width: '120px', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{t(`autoResponses.${regla.type}`,(regla.type||'-'))}</td>
                  <td style={{padding:'8px 6px', maxWidth: '220px', width: '220px', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{Array.isArray(regla.categorias) ? regla.categorias.map(cat => t(`autoResponses.${cat}Category`,cat)).join(', ') : '-'}</td>
                  <td style={{padding:'8px 6px'}}>
                    <span
                      style={{background: regla.estado === 'activa' ? '#10b981' : '#888', color:'#fff', borderRadius:6, padding:'2px 12px', fontWeight:700, fontSize:14, cursor:'pointer'}}
                      title={regla.estado === 'activa' ? t('autoResponses.active','Activo') : t('autoResponses.inactive','Inactiva')}
                      onClick={async () => {
                        const nuevoEstado = regla.estado === 'activa' ? 'inactiva' : 'activa';
                        const res = await fetch(`https://aura-0244.onrender.com/api/reglas/${regla._id}/estado`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ estado: nuevoEstado })
                        });
                        if (res.ok) {
                          const actualizada = await res.json();
                          setReglas(rs => rs.map(r => r._id === regla._id ? actualizada : r));
                        } else {
                          alert('Error al cambiar estado');
                        }
                      }}
                    >
                      {regla.estado === 'activa' ? t('autoResponses.active','Activo') : t('autoResponses.inactive','Inactiva')}
                    </span>
                  </td>
                  <td style={{padding:'8px 6px', maxWidth: '560px', width: '560px', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{regla.respuestaAutomatica}</td>
                  <td style={{padding:'8px 6px'}}>
                    <button
                      style={{background: darkMode ? '#232a3b' : '#e0e7ef',color: darkMode ? '#fff' : '#232a3b',fontWeight:600,padding:'6px 12px',border:'none',borderRadius:6,cursor:'pointer',marginRight:6}}
                      onClick={() => {
                        setEditId(regla._id);
                        setEditValue(regla.respuestaAutomatica);
                        setShowEditModal(true);
                      }}
                    >{t('autoResponses.edit','Editar')}</button>
                    <button
                      style={{background: darkMode ? '#232a3b' : '#e0e7ef',color: darkMode ? '#fff' : '#232a3b',fontWeight:600,padding:'6px 12px',border:'none',borderRadius:6,cursor:'pointer',marginRight:6}}
                      onClick={async () => {
                        const res = await fetch(`https://aura-0244.onrender.com/api/reglas/${regla._id}/duplicar`, { method: 'POST' });
                        if (res.ok) {
                          const nueva = await res.json();
                          setReglas(rs => [nueva, ...rs]);
                          // Notificación: regla duplicada
                          if (typeof setNotifications === 'function' && typeof setNotificationCount === 'function') {
                            setNotifications(prev => {
                              const noti = {
                                id: Date.now(),
                                text: t('notifications.ruleDuplicated', 'Regla duplicada'),
                                date: new Date().toISOString()
                              };
                              const newArr = [noti, ...(Array.isArray(prev) ? prev : [])];
                              setNotificationCount(newArr.length);
                              return newArr;
                            });
                          }
                        } else {
                          alert('Error al duplicar');
                        }
                      }}
                    >{t('autoResponses.duplicate','Duplicar')}</button>
                    <button
                      style={{background:'#e53e3e',color:'#fff',fontWeight:600,padding:'6px 12px',border:'none',borderRadius:6,cursor:'pointer'}}
                      onClick={async () => {
                        if (window.confirm(t('autoResponses.confirmDelete','¿Seguro que quieres eliminar esta regla?'))) {
                          const res = await fetch(`https://aura-0244.onrender.com/api/reglas/${regla._id}`, { method: 'DELETE' });
                          if (res.ok) {
                            setReglas(rs => rs.filter(r => r._id !== regla._id));
                            // Notificación: regla eliminada
                            if (typeof setNotifications === 'function' && typeof setNotificationCount === 'function') {
                              setNotifications(prev => {
                                const noti = {
                                  id: Date.now(),
                                  text: t('notifications.ruleDeleted', 'Regla eliminada'),
                                  date: new Date().toISOString()
                                };
                                const newArr = [noti, ...(Array.isArray(prev) ? prev : [])];
                                setNotificationCount(newArr.length);
                                return newArr;
                              });
                            }
                          } else {
                            alert('Error al eliminar');
                          }
                        }
                      }}
                    >{t('autoResponses.delete','Eliminar')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal de edición de respuesta automática fuera del tbody y del mapeo */}
          {showEditModal && (
            <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#0008',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{background:'#fff',padding:32,borderRadius:12,minWidth:320,maxWidth:480,boxShadow:'0 2px 12px #0002',color:'#232a3b'}}>
                <h3 style={{marginBottom:18}}>Editar mensaje de respuesta</h3>
                <textarea
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={{width:'100%',minHeight:80,padding:8,borderRadius:6,border:'1px solid #ccc',marginBottom:18}}
                />
                <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                  <button
                    style={{background:'#188fd9',color:'#fff',fontWeight:700,padding:'8px 18px',border:'none',borderRadius:8,cursor:'pointer'}}
                    onClick={async () => {
                      const res = await fetch(`https://aura-0244.onrender.com/api/reglas/${editId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ respuestaAutomatica: editValue })
                      });
                      if (res.ok) {
                        const actualizada = await res.json();
                        setReglas(rs => rs.map(r => r._id === editId ? actualizada : r));
                        setShowEditModal(false);
                        // Notificación: regla editada
                        if (typeof setNotifications === 'function' && typeof setNotificationCount === 'function') {
                          setNotifications(prev => {
                            const noti = {
                              id: Date.now(),
                              text: t('notifications.ruleEdited', 'Regla editada'),
                              date: new Date().toISOString()
                            };
                            const newArr = [noti, ...(Array.isArray(prev) ? prev : [])];
                            setNotificationCount(newArr.length);
                            return newArr;
                          });
                        }
                      } else {
                        alert('Error al editar');
                      }
                    }}
                  >Guardar</button>
                  <button
                    style={{background:'#fff',color:'#888',fontWeight:600,padding:'8px 18px',border:'1px solid #ccc',borderRadius:8,cursor:'pointer'}}
                    onClick={() => setShowEditModal(false)}
                  >Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RespuestasPanel;
