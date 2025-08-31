// Guarda la imagen del robot en la carpeta assets y usa este componente para mostrarla animada
import React from 'react';
import { motion } from 'framer-motion';
import robotImg from './robot-aura.png';

export default function AnimatedRobot({ style = {}, className = '' }) {
  return (
    <motion.img
      src={robotImg}
      alt="Aura Robot"
      style={{ width: 160, height: 'auto', ...style }}
      className={className}
      initial={{ y: -10, rotate: 0 }}
      animate={{ y: [ -10, -20, -10, -16, -10 ], rotate: [0, 10, -10, 0, 0] }}
      transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
    />
  );
}
