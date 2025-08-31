import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProfileModal.css';

const ProfileModal = ({ open, onClose, user }) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nombre: user.nombre || '',
    apellidos: user.apellidos || '',
    usuario: user.usuario || user.username || '',
    correo: user.email || '',
    ciudad: '',
    edad: '',
    genero: '',
  });

  // Ensure usuario and correo are always loaded from user prop if it changes
  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      nombre: user.nombre || '',
      apellidos: user.apellidos || '',
      usuario: user.usuario || user.username || '',
      correo: user.email || '',
    }));
  }, [user]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditMode(true);
  const handleSave = async () => {
    // Solo nombre y apellidos se envían al backend
    try {
      await fetch('/api/usuario/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si usas JWT, agrega el header Authorization aquí
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellidos: form.apellidos,
          correo: user.email // para identificar el usuario
        })
      });
    } catch (err) {
      // Manejo de error opcional
    }
    setEditMode(false);
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="profile-modal-header">
          <h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>{t('profileUser.titulo')}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="profile-modal-content">
          <div className="profile-modal-col">
            <label>{t('profileUser.nombre')}</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} disabled={!editMode} />
            <label>{t('profileUser.apellidos')}</label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} disabled={!editMode} />
            <label>{t('profileUser.ciudad')}</label>
            <input name="ciudad" value={form.ciudad} onChange={handleChange} disabled={!editMode} />
            <label>{t('profileUser.edad')}</label>
            <input name="edad" value={form.edad} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="profile-modal-col">
            <label>{t('profileUser.usuario')}</label>
            <input name="usuario" value={form.usuario} disabled />
            <label>{t('profileUser.correo')}</label>
            <input name="correo" value={form.correo} disabled />
            <label>{t('profileUser.genero')}</label>
            <select name="genero" value={form.genero} onChange={handleChange} disabled={!editMode}>
              <option value="">{t('profileUser.selecciona')}</option>
              <option value="masculino">{t('profileUser.masculino')}</option>
              <option value="femenino">{t('profileUser.femenino')}</option>
              <option value="otro">{t('profileUser.otro')}</option>
            </select>
          </div>
        </div>
        <div className="profile-modal-footer">
          {editMode ? (
            <button className="save-btn" onClick={handleSave}>Guardar</button>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>{t('profileUser.editar')}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
