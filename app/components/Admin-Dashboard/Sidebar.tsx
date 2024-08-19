// components/Sidebar.tsx
import React from 'react';
import { Upload, BarChart2 } from 'lucide-react';

interface SidebarProps {
  setView: (view: 'upload' | 'visualize') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>
      <nav className="mt-6">
        <button
          onClick={() => setView('upload')}
          className="w-full flex items-center p-4 text-gray-700 hover:bg-gray-100"
        >
          <Upload className="mr-4" />
          Cargar Métricas
        </button>
        <button
          onClick={() => setView('visualize')}
          className="w-full flex items-center p-4 text-gray-700 hover:bg-gray-100"
        >
          <BarChart2 className="mr-4" />
          Visualizar Métricas
        </button>
      </nav>
    </div>
  );
};