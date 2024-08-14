'use client'
import React, { useState, useEffect } from 'react';
import { parseCSV, EmployeeMetrics } from '@/lib/excelParser';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { insertEmployeeMetric, getEmployeeMetrics, createEmployeeMetricsTable } from '@/utils/database';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MetricCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const EmployeeCard: React.FC<{ employee: EmployeeMetrics }> = ({ employee }) => {
  const timeDistribution = [
    { name: 'Ready', value: employee['% de Ready'] },
    { name: 'ACD', value: employee['% de ACD'] },
    { name: 'No Disp. Total', value: employee['% de No Disp. Total'] },
  ];

  const performanceData = [
    { name: 'NPS', value: employee.NPS },
    { name: 'SAT', value: employee.SAT },
    { name: 'RD', value: employee.RD },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{employee.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
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
            <h3 className="text-lg font-semibold mb-2">Rendimiento</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CallCenterDashboard() {
  const [employees, setEmployees] = useState<EmployeeMetrics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createEmployeeMetricsTable();
        console.log('Employee metrics table initialized');
      } catch (error) {
        console.error('Error initializing employee metrics table:', error);
      }
    };
  
    initializeDatabase();
  }, []);

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

  const saveToDatabase = async () => {
    if (employees.length === 0) return;
  
    setIsSaving(true);
    try {
      for (const employee of employees) {
        await insertEmployeeMetric({
          nombre: employee.nombre,
          Atendidas: employee.Atendidas,
          'Tiempo Atencion': employee['Tiempo Atencion'],
          'Prom. T. Atención (min)': employee['Prom. T. Atención (min)'],
          'Prom. T Ringing (seg)': employee['Prom. T Ringing (seg)'],
          'Q de Encuestas': employee['Q de Encuestas'],
          NPS: employee.NPS,
          SAT: employee.SAT,
          RD: employee.RD,
          'Días Logueado': employee['Días Logueado'],
          'Prom. Logueo': employee['Prom. Logueo'],
          '% de Ready': employee['% de Ready'],
          '% de ACD': employee['% de ACD'],
          '% de No Disp. Total': employee['% de No Disp. Total'],
          '% No Disp. No Productivo': employee['% No Disp. No Productivo'],
          '% No Disp. Productivo': employee['% No Disp. Productivo'],
          'Promedio Calidad': employee['Promedio Calidad'],
          'Ev. Actitudinal': employee['Ev. Actitudinal'],
          'Prom. Llam. X hora en función de Tiempo de habla y No disponible': employee['Prom. Llam. X hora en función de Tiempo de habla y No disponible'],
          'Priorización': employee['Priorización']
        });
      }
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEmployees = employees.filter(employee => 
    employee.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Métricas Mensuales</h1>
      
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
  onClick={saveToDatabase}
  disabled={isSaving || employees.length === 0}
  className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold disabled:bg-gray-400"
>
  {isSaving ? 'Guardando...' : 'Guardar en Base de Datos'}
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