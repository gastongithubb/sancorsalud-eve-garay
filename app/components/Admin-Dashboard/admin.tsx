// File: app/components/CallCenterDashboard.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { parseCSV, EmployeeMetrics } from '@/lib/excelParser'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MetricCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
  <div className="border p-4 rounded shadow">
    <h3 className="font-bold text-sm">{title}</h3>
    <p className="text-xl">{value}</p>
  </div>
)

const EmployeeCard: React.FC<{ employee: EmployeeMetrics }> = ({ employee }) => {
  const timeDistribution = [
    { name: 'Ready', value: employee['% de Ready'] },
    { name: 'ACD', value: employee['% de ACD'] },
    { name: 'No Disp. Total', value: employee['% de No Disp. Total'] },
  ];

  return (
    <div className="border p-4 rounded shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">{employee.nombre}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Métricas Clave</h3>
          <div className="grid grid-cols-2 gap-2">
            <MetricCard title="Atendidas" value={employee.Atendidas} />
            <MetricCard title="NPS" value={employee.NPS} />
            <MetricCard title="SAT" value={`${employee.SAT}%`} />
            <MetricCard title="RD" value={`${employee.RD}%`} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Distribución de Tiempo</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={timeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {timeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Tiempos de Atención</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[employee]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Prom. T. Atención (min)" fill="#8884d8" />
              <Bar dataKey="Prom. T Ringing (seg)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Calidad y Retención</h3>
          <div className="grid grid-cols-2 gap-2">
            <MetricCard title="Promedio Calidad" value={employee['Promedio Calidad']} />
            <MetricCard title='Retención "Otros Fidelizables"' value={`${employee['Retención "Otros Fidelizables"']}%`} />
            <MetricCard title="Priorización" value={employee['Priorización']} />
            <MetricCard title="Prom. Llam. X hora" value={employee['Prom. Llam. X hora en función de Tiempo de habla y No disponible'].toFixed(1)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CallCenterDashboard() {
  const [employees, setEmployees] = useState<EmployeeMetrics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const parsedData = parseCSV(content);
          setEmployees(parsedData);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveAllEmployees = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/save-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employees),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save employees data');
      }
  
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000); // Reset status after 3 seconds
    } catch (error) {
      console.error('Error saving employees data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000); // Reset status after 3 seconds
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Metricas mensuales</h1>
      
      <div className="mb-8 flex justify-between items-center">
        <div>
          <input 
            type="file" 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-4 p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSaveAllEmployees}
          className={`px-4 py-2 rounded ${
            saveStatus === 'idle' ? 'bg-blue-500 hover:bg-blue-600' :
            saveStatus === 'saving' ? 'bg-yellow-500' :
            saveStatus === 'saved' ? 'bg-green-500' :
            'bg-red-500'
          } text-white font-bold`}
          disabled={saveStatus === 'saving' || employees.length === 0}
        >
          {saveStatus === 'idle' ? 'Guardar Todos' :
           saveStatus === 'saving' ? 'Guardando...' :
           saveStatus === 'saved' ? 'Guardado' :
           'Error al guardar'}
        </button>
      </div>

      {filteredEmployees.length > 0 ? (
        filteredEmployees.map((employee, index) => (
          <EmployeeCard 
            key={index} 
            employee={employee}
          />
        ))
      ) : (
        <p>No hay datos para mostrar. Por favor, cargue un archivo CSV o ajuste su búsqueda.</p>
      )}
    </main>
  );
}