import React from 'react';
import { Upload, BarChart2, UserRoundPen, Coffee } from 'lucide-react';
import { Button } from "@/app/components/ui/button"

interface SidebarProps {
  setView: (view: 'upload' | 'visualize' | 'personal' | 'breaks') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>
      <nav className="mt-6 flex flex-col gap-2 p-4">
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setView('upload')}
        >
          <Upload className="mr-2 h-4 w-4" />
          Cargar Métricas
        </Button>
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setView('visualize')}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Visualizar Métricas
        </Button>
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setView('personal')}
        >
          <UserRoundPen className="mr-2 h-4 w-4" />
          Personal
        </Button>
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setView('breaks')}
        >
          <Coffee className="mr-2 h-4 w-4" />
          Breaks
        </Button>
      </nav>
    </div>
  );
};