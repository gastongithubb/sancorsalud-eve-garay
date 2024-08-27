import React from 'react';
import Image from 'next/image';

const SancorSaludLoading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="relative w-32 h-32">
        {/* Círculo exterior */}
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        {/* Arco animado */}
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }}></div>
        {/* Imagen de Sancor Salud */}
        <div className="absolute inset-0 flex justify-center items-center">
          <Image 
            src="/logospinner.png"
            alt="Logo Sancor Salud"
            width={220}
            height={220}
            className="object-contain"
          />
        </div>
      </div>
      <p className="mt-4 text-xl font-semibold text-blue-600">Cargando...</p>
    </div>
  );
};

export default SancorSaludLoading;