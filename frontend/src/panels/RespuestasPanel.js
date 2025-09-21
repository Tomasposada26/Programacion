import React, { useState, useEffect } from 'react';
import '../styles/RespuestasPanel.css';



const RespuestasPanel = ({ setGlobalNotifications, setNotificationCount, user }) => {
  const [form, setForm] = useState({
    trigger: '',
    type: '',
    categories: [],
    advanced: '',
    response: '',
    notes: '',
    state: true
  });
  const [reglas, setReglas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!user || !user.token) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/reglas`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setReglas(Array.isArray(data) ? data : []));
  }, [user]);

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

  const handleSubmit = async e => {
    e.preventDefault();
    const nueva = {
      tipoInteraccion: form.trigger,
      type: form.type,
      categorias: form.categories,
      respuestaAutomatica: form.response,
      notasInternas: form.notes,
      estado: form.state ? 'activa' : 'inactiva',
  userId: user?._id || ''
    };
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reglas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(nueva)
      });
      if (res.ok) {
        const reglaCreada = await res.json();
        setReglas(rs => [reglaCreada, ...rs]);
        setForm({ trigger: '', type: '', categories: [], advanced: '', response: '', notes: '', state: true });
        if (typeof setGlobalNotifications === 'function' && typeof setNotificationCount === 'function') {
          setGlobalNotifications(prev => {
            const noti = {
              id: Date.now(),
              text: 'Nueva regla agregada exitosamente',
              date: new Date().toISOString(),
              _tipo: 'general'
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

  const darkMode = document.body.classList.contains('aura-dark') || document.documentElement.classList.contains('aura-dark');
  const cardStyles = {
    background: darkMode ? '#2d323b' : '#f8faff',
    color: darkMode ? '#fff' : '#232a3b',
    borderRadius: 0,
    width: 'calc(100vw - 340px - 20px)',
    maxWidth: 'none',
  marginRight: '20px',
  marginBottom: '48px', // separa el card del borde inferior
  height: 'calc(100vh - 120px)',
  maxHeight: 'calc(100vh - 120px)',
  minHeight: 600,
    boxShadow: darkMode ? '0 4px 24px #10b98144' : '0 4px 24px #10b98122',
    fontWeight: 400,
    fontSize: 16,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: '5px 30px 32px 38px',
    gap: 32,
    transition: 'background 0.3s, color 0.3s',
    overflowY: 'scroll',
    overflowX: 'auto',
    zIndex: 1
  };

  return (
    <div className="respuestas-panel aura-main-panel-bg">
      <div style={cardStyles}>
        <div style={{height: 16}} />
        {/* <h2>Respuestas Automáticas</h2> */}
        <form
          style={{
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
          }}
          onSubmit={handleSubmit}
        >
          <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>Añadir Nueva Regla</div>
          <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:220}}>
              <label style={{fontWeight:600}}>Disparador:</label><br/>
              <select name="trigger" value={form.trigger} onChange={handleChange} required style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}}>
                <option value="">Select...</option>
                <option value="like">Me gusta</option>
                <option value="comment">Comentario</option>
                <option value="share">Compartido</option>
              </select>
            </div>
            <div style={{flex:1,minWidth:220}}>
              <label style={{fontWeight:600}}>Tipo de Publicación:</label><br/>
              <select name="type" value={form.type} onChange={handleChange} required style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}}>
                <option value="">Select...</option>
                <option value="post">Publicación</option>
                <option value="reel">Reel</option>
                <option value="story">Historia</option>
              </select>
            </div>
            <div style={{flex:2,minWidth:260}}>
              <label style={{fontWeight:600}}>Categorías a Escuchar:</label><br/>
              <div style={{display:'flex',gap:18,marginTop:4}}>
                <label><input type="checkbox" name="categories" value="vacantes" checked={form.categories.includes('vacantes')} onChange={handleChange}/> Vacantes</label>
                <label><input type="checkbox" name="categories" value="eventos" checked={form.categories.includes('eventos')} onChange={handleChange}/> Eventos</label>
                <label><input type="checkbox" name="categories" value="reuniones" checked={form.categories.includes('reuniones')} onChange={handleChange}/> Reuniones</label>
              </div>
            </div>
          </div>
          <div>
            <label style={{fontWeight:600}}>Condiciones Avanzadas (opcional):</label><br/>
            <input type="text" name="advanced" value={form.advanced} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}} placeholder="Palabras clave, horario, usuario específico..."/>
          </div>
          <div>
            <label style={{fontWeight:600}}>Mensaje de Respuesta:</label><br/>
            <textarea name="response" value={form.response} onChange={handleChange} required style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4,minHeight:60}} placeholder="Mensaje que enviará el bot. Puedes usar {nombre_usuario}, {link}, etc."/>
          </div>
          <div>
            <label style={{fontWeight:600}}>Descripción/Notas internas (opcional):</label><br/>
            <input type="text" name="notes" value={form.notes} onChange={handleChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ccc',marginTop:4}} placeholder="Solo visible para administradores"/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:18}}>
            <label style={{fontWeight:600}}>Estado:</label>
            <input type="checkbox" name="state" checked={form.state} onChange={handleChange} style={{marginRight:6}}/> Activo
          </div>
          <div style={{display:'flex',gap:12,marginTop:8}}>
            <button type="submit" style={{background:'#188fd9',color:'#fff',fontWeight:700,padding:'10px 28px',border:'none',borderRadius:8,fontSize:16,cursor:'pointer',boxShadow:'0 2px 8px #188fd922'}}>Guardar Regla</button>
            <button type="button" style={{background:'#fff',color:'#888',fontWeight:600,padding:'10px 18px',border:'1px solid #ccc',borderRadius:8,fontSize:16,cursor:'pointer'}}>Cancelar</button>
          </div>
        </form>
        <div
          style={{
            background: darkMode ? '#181c24' : '#fff',
            color: darkMode ? '#fff' : '#232a3b',
            borderRadius:12,
            padding:'18px 18px 8px 18px',
            boxShadow:'0 2px 8px #0001',
            transition:'background 0.3s, color 0.3s',
            marginTop: 2 // separa el card de la tabla del formulario de arriba
          }}
        >
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div>
              <button style={{marginRight:8,background:'#e0e7ef',color:'#232a3b',fontWeight:600,padding:'6px 16px',border:'none',borderRadius:6,cursor:'pointer'}}>Exportar JSON</button>
              <button style={{background:'#e0e7ef',color:'#232a3b',fontWeight:600,padding:'6px 16px',border:'none',borderRadius:6,cursor:'pointer'}}>Importar JSON</button>
            </div>
          </div>
          <table
            style={{
              width:'100%',
              borderCollapse:'collapse',
              fontSize:15,
              background: darkMode ? '#181c24' : '#fff',
              color: darkMode ? '#fff' : '#232a3b',
              transition:'background 0.3s, color 0.3s'
            }}
          >
            <thead>
              <tr style={{background: darkMode ? '#232a3b' : '#f4f6fb',fontWeight:700,color: darkMode ? '#fff' : '#232a3b'}}>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '90px', width: '90px', whiteSpace: 'normal'}}>Disparador</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '120px', width: '120px', whiteSpace: 'normal'}}>Tipo</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '220px', width: '220px', whiteSpace: 'normal'}}>Categorías</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0'}}>Estado</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0', maxWidth: '560px', width: '560px', whiteSpace: 'normal'}}>Respuesta</th>
                <th style={{padding:'8px 6px',borderBottom:'1px solid #e0e0e0'}}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{background: darkMode ? '#181c24' : '#fff', color: darkMode ? '#fff' : '#232a3b'}}>
              {reglas.map(regla => (
                <tr key={regla._id}>
                  <td style={{padding:'8px 6px', maxWidth: '90px', width: '90px', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{regla.tipoInteraccion || '-'}</td>
                  <td style={{padding:'8px 6px', maxWidth: '120px', width: '120px', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{regla.type || '-'}</td>
                  <td style={{padding:'8px 6px', maxWidth: '220px', width: '220px', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{Array.isArray(regla.categorias) ? regla.categorias.join(', ') : '-'}</td>
                  <td style={{padding:'8px 6px'}}>
                    <span
                      style={{background: regla.estado === 'activa' ? '#10b981' : '#888', color:'#fff', borderRadius:6, padding:'2px 12px', fontWeight:700, fontSize:14, cursor:'pointer'}}
                      title={regla.estado === 'activa' ? 'Activo' : 'Inactiva'}
                      onClick={async () => {
                        const nuevoEstado = regla.estado === 'activa' ? 'inactiva' : 'activa';
                        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reglas/${regla._id}/estado`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user?.token}`
                          },
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
                      {regla.estado === 'activa' ? 'Activo' : 'Inactiva'}
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
                    >Editar</button>
                    <button
                      style={{background: darkMode ? '#232a3b' : '#e0e7ef',color: darkMode ? '#fff' : '#232a3b',fontWeight:600,padding:'6px 12px',border:'none',borderRadius:6,cursor:'pointer',marginRight:6}}
                      onClick={async () => {
                        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reglas/${regla._id}/duplicar`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${user?.token}`
                          }
                        });
                        if (res.ok) {
                          const nueva = await res.json();
                          setReglas(rs => [nueva, ...rs]);
                          if (typeof setGlobalNotifications === 'function' && typeof setNotificationCount === 'function') {
                            setGlobalNotifications(prev => {
                              const noti = {
                                id: Date.now(),
                                text: 'Regla duplicada exitosamente',
                                date: new Date().toISOString(),
                                _tipo: 'general'
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
                    >Duplicar</button>
                    <button
                      style={{background:'#e53e3e',color:'#fff',fontWeight:600,padding:'6px 12px',border:'none',borderRadius:6,cursor:'pointer'}}
                      onClick={() => {
                        setDeleteId(regla._id);
                        setShowDeleteModal(true);
                      }}
                    >Eliminar</button>
      {showDeleteModal && (
        <div
          style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}
          onMouseDown={e => e.stopPropagation()}
        >
          <div
            style={{background:'#fff',padding:32,borderRadius:12,minWidth:320,maxWidth:400,boxShadow:'0 2px 12px #0002',color:'#232a3b',textAlign:'center'}}
            onMouseDown={e => e.stopPropagation()}
          >
            <h3 style={{marginBottom:18}}>¿Seguro que quieres eliminar esta regla?</h3>
            <div style={{display:'flex',gap:16,justifyContent:'center',marginTop:24}}>
              <button
                style={{background:'#e53e3e',color:'#fff',fontWeight:700,padding:'10px 24px',border:'none',borderRadius:8,fontSize:16,cursor:'pointer'}}
                onClick={async () => {
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reglas/${deleteId}`, {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${user?.token}`
                    }
                  });
                  if (res.ok) {
                    setReglas(rs => rs.filter(r => r._id !== deleteId));
                    if (typeof setGlobalNotifications === 'function' && typeof setNotificationCount === 'function') {
                      setGlobalNotifications(prev => {
                        const noti = {
                          id: Date.now(),
                          text: 'Regla eliminada exitosamente',
                          date: new Date().toISOString(),
                          _tipo: 'general'
                        };
                        const newArr = [noti, ...(Array.isArray(prev) ? prev : [])];
                        setNotificationCount(newArr.length);
                        return newArr;
                      });
                    }
                  } else {
                    alert('Error al eliminar');
                  }
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
              >Confirmar</button>
              <button
                style={{background:'#188fd9',color:'#fff',fontWeight:700,padding:'10px 24px',border:'none',borderRadius:8,fontSize:16,cursor:'pointer'}}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reglas/${editId}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${user?.token}`
                        },
                        body: JSON.stringify({ respuestaAutomatica: editValue })
                      });
                      if (res.ok) {
                        const actualizada = await res.json();
                        setReglas(rs => rs.map(r => r._id === editId ? actualizada : r));
                        setShowEditModal(false);
                        if (typeof setGlobalNotifications === 'function' && typeof setNotificationCount === 'function') {
                          setGlobalNotifications(prev => {
                            const noti = {
                              id: Date.now(),
                              text: 'Regla editada exitosamente',
                              date: new Date().toISOString(),
                              _tipo: 'general'
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