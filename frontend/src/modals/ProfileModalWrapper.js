import React from 'react';
import ProfileModal from '../modals/ProfileModal';

const ProfileModalWrapper = ({ show, onClose, user, onUserUpdate }) => {
  if (!show) return null;
  return <ProfileModal open={show} onClose={onClose} user={user} onUserUpdate={onUserUpdate} />;
};

export default ProfileModalWrapper;
