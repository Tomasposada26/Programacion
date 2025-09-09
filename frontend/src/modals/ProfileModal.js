import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { ciudadesPaises } from '../utils/ciudadesPaises';
import { toast } from "react-toastify";
import '../styles/ProfileModal.css';

const ProfileModal = ({ open, onClose, user, onUserUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteFinal, setShowDeleteFinal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteError, setDeleteError] = useState('');
  // Estado para el texto de búsqueda en el autocompletado
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    correo: '',
    ciudad: '',
    fechaNacimiento: '',
    genero: '',
  });
  const [lastSaved, setLastSaved] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      nombre: user?.nombre || '',
      apellidos: user?.apellidos || '',
      usuario: user?.usuario || user?.username || '',
      correo: user?.correo || user?.email || '',
      ciudad: user?.ciudad || '',
      fechaNacimiento: user?.fecha_nacimiento || '',
      genero: user?.genero || '',
    }));
    setLastSaved({
      nombre: user?.nombre || '',
      apellidos: user?.apellidos || '',
    });
    setEditMode(false);
  }, [user]);

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (editMode) {
          setEditMode(false);
          setForm((prev) => ({
            ...prev,
            nombre: lastSaved.nombre,
            apellidos: lastSaved.apellidos,
          }));
        } else {
          onClose();
        }
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, editMode, lastSaved, onClose]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditMode(true);

  // Eliminar cuenta - doble confirmación
  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
    setDeleteInput('');
    setDeleteError('');
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setShowDeleteFinal(false);
    setDeleteInput('');
    setDeleteError('');
  };

  const handleDeleteContinue = () => {
    setShowDeleteConfirm(false);
    setShowDeleteFinal(true);
    setDeleteInput('');
    setDeleteError('');
  };

  const handleDeleteFinal = async () => {
    if (deleteInput.trim() !== (form.usuario || user?.usuario || user?.username)) {
      setDeleteError('El nombre de usuario no coincide.');
      return;
    }
    try {
      await fetch(`/api/usuarios/api/usuario/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: form.correo })
      });
      toast.success('Cuenta eliminada correctamente');
      window.location.reload();
    } catch (err) {
      setDeleteError('Error al eliminar la cuenta');
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/usuarios/api/usuario/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellidos: form.apellidos,
          correo: form.correo,
          ciudad: form.ciudad,
          pais: form.ciudad?.split(',')[1]?.trim() || '',
          genero: form.genero,
          fecha_nacimiento: form.fechaNacimiento,
          edad: form.fechaNacimiento ? Math.floor((Date.now() - new Date(form.fechaNacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : ''
        })
      });
      // Volver a consultar los datos actualizados del usuario
      const res = await fetch(`/api/usuarios/api/usuario/info?usuario=${encodeURIComponent(form.usuario)}`);
      if (res.ok) {
        const updatedUser = await res.json();
        setForm((prev) => ({
          ...prev,
          nombre: updatedUser.nombre || '',
          apellidos: updatedUser.apellidos || '',
          ciudad: updatedUser.ciudad || '',
          fechaNacimiento: updatedUser.fecha_nacimiento || '',
          genero: updatedUser.genero || '',
        }));
        setLastSaved({ nombre: updatedUser.nombre, apellidos: updatedUser.apellidos });
        if (onUserUpdate) {
          onUserUpdate({ ...user, ...updatedUser });
        }
      }
      toast.success('Datos actualizados correctamente');
    } catch (err) {}
    setEditMode(false);
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        <div className="profile-modal-header">
          <h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>
            Perfil de usuario
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="profile-modal-content">
          <div className="profile-modal-col">
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} disabled={!editMode} />
            <label>Apellidos</label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} disabled={!editMode} />
            <label>Ciudad / País</label>
            <Select
              options={ciudadesPaises}
              isClearable
              isDisabled={!editMode}
              value={form.ciudad ? { value: form.ciudad, label: form.ciudad } : null}
              onChange={option => {
                const value = option ? option.value : '';
                setForm(prev => ({ ...prev, ciudad: value }));
              }}
              placeholder="De donde eres..."
              styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
              filterOption={(option, input) => option.label.toLowerCase().includes(input.toLowerCase())}
            />
            {editMode && (
              <small>Puedes escribir y seleccionar de la lista, o ingresar manualmente tu ciudad y país.</small>
            )}
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              disabled={!editMode}
              max={new Date().toISOString().split('T')[0]}
            />
            <label>Edad</label>
            <input
              name="edad"
              value={form.fechaNacimiento ? (Math.floor((Date.now() - new Date(form.fechaNacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : ''}
              disabled
            />
          </div>
          <div className="profile-modal-col">
            <label>Usuario</label>
            <input name="usuario" value={form.usuario} disabled />
            <label>Correo</label>
            <input name="correo" value={form.correo} disabled />
            <label>Género</label>
            <select name="genero" value={form.genero} onChange={handleChange} disabled={!editMode}>
              <option value="">Selecciona</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>
        <div className="profile-modal-footer" style={{display:'flex', gap:12, alignItems:'center'}}>
          {!editMode && (
            <button className="delete-btn" style={{background:'#e53e3e', color:'#fff', fontWeight:700, border:'none', borderRadius:6, padding:'8px 18px', cursor:'pointer'}} onClick={handleDeleteAccount}>Eliminar cuenta</button>
          )}
          {editMode ? (
            <button className="save-btn" onClick={handleSave}>Guardar</button>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>Editar</button>
          )}
        </div>

        {/* Primer modal de confirmación */}
        {showDeleteConfirm && (
          <div className="profile-modal-overlay" style={{zIndex:1001, position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div className="profile-modal" style={{maxWidth:400, textAlign:'center'}}>
              <h3>¿Estás seguro?</h3>
              <p>Esta acción eliminará tu cuenta y todos tus datos de forma permanente.</p>
              <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:24}}>
                <button onClick={handleDeleteCancel} style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#aaa', color:'#fff', fontWeight:700}}>Cancelar</button>
                <button onClick={handleDeleteContinue} style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#e53e3e', color:'#fff', fontWeight:700}}>Continuar</button>
              </div>
            </div>
          </div>
        )}

        {/* Segundo modal: escribir nombre de usuario */}
        {showDeleteFinal && (
          <div className="profile-modal-overlay" style={{zIndex:1002, position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div className="profile-modal" style={{maxWidth:400, textAlign:'center'}}>
              <h3>Confirmar eliminación</h3>
              <p>Para eliminar tu cuenta, escribe tu nombre de usuario:<br /><b>{form.usuario || user?.usuario || user?.username}</b></p>
              <input type="text" value={deleteInput} onChange={e => { setDeleteInput(e.target.value); setDeleteError(''); }} style={{margin:'16px 0', width:'80%', padding:8, borderRadius:6, border:'1px solid #ccc'}} autoFocus />
              {deleteError && <div style={{color:'#e53e3e', marginBottom:8}}>{deleteError}</div>}
              <div style={{display:'flex', gap:12, justifyContent:'center'}}>
                <button onClick={handleDeleteCancel} style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#aaa', color:'#fff', fontWeight:700}}>Cancelar</button>
                <button onClick={handleDeleteFinal} style={{padding:'8px 18px', borderRadius:6, border:'none', background:'#e53e3e', color:'#fff', fontWeight:700}}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;