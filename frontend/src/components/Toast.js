import React, { useEffect, useRef } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  const progressRef = useRef();
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    if (progressRef.current) {
      progressRef.current.style.transition = `width ${duration}ms linear`;
      progressRef.current.style.width = '0%';
    }
    return () => clearTimeout(timer);
  }, [onClose, duration]);
  return (
    <div className={`toast toast-${type}`}> 
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>&times;</button>
      <div className="toast-progress-bar" ref={progressRef} />
    </div>
  );
};

export default Toast;
