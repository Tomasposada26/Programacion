import React from 'react';

export default function BellIcon({ size = 32, color = '#FFA500', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 24c1.326 0 2.402-1.076 2.402-2.402h-4.805c0 1.326 1.077 2.402 2.403 2.402zm6.937-6.937V11c0-3.615-2.275-6.648-5.56-7.664V2.937c0-.962-.78-1.742-1.742-1.742s-1.742.78-1.742 1.742v.399C6.607 4.352 4.332 7.385 4.332 11v6.063L2 19.395v1.742h20v-1.742l-3.063-2.332z"/>
    </svg>
  );
}
