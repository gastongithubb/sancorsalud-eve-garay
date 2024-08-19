// File: CallCenterDashboard.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { parseCSV } from '@/lib/excelParser';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { insertEmployeeMetric, EmployeeMetrics, createOrUpdateEmployeeMetricsTable } from '@/utils/database';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MetricCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const EmployeeCard: React.FC<{ employee: EmployeeMetrics }> = ({ employee }) => {
  const timeDistribution = [
    { name: 'Ready', value: employee.PorcentajeReady },
    { name: 'ACD', value: employee.PorcentajeACD },
    { name: 'No Disp. Total', value: employee.PorcentajeNoDispTotal },
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
                <Bar dataKey="PromTAtencionMin" fill="#8884d8" />
                <Bar dataKey="PromTRingingSeg" fill="#82ca9d" />
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

const CallCenterDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeMetrics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createOrUpdateEmployeeMetricsTable();
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
          const mappedData: EmployeeMetrics[] = parsedData.map(employee => ({
            nombre: employee.nombre,
            Atendidas: Number(employee.Atendidas),
            TiempoAtencion: Number(employee.TiempoAtencion),
            PromTAtencionMin: Number(employee.PromTAtencionMin),
            PromTRingingSeg: Number(employee.PromTRingingSeg),
            QdeEncuestas: Number(employee.QdeEncuestas),
            NPS: Number(employee.NPS),
            SAT: Number(employee.SAT),
            RD: Number(employee.RD),
            DiasLogueado: Number(employee.DiasLogueado),
            PromLogueo: employee.PromLogueo,
            PorcentajeReady: Number(employee.PorcentajeReady),
            PorcentajeACD: Number(employee.PorcentajeACD),
            PorcentajeNoDispTotal: Number(employee.PorcentajeNoDispTotal),
            PorcentajeNoDispNoProductivo: Number(employee.PorcentajeNoDispNoProductivo),
            PorcentajeNoDispProductivo: Number(employee.PorcentajeNoDispProductivo),
            PromedioCalidad: Number(employee.PromedioCalidad),
            EvActitudinal: employee.EvActitudinal,
            PromLlamXHora: Number(employee.PromLlamXHora),
            Priorizacion: employee.Priorizacion
          }));
          setEmployees(mappedData);
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
        const mappedEmployee: EmployeeMetrics = {
          nombre: employee.nombre,
          Atendidas: employee.Atendidas,
          TiempoAtencion: employee.TiempoAtencion,
          PromTAtencionMin: employee.PromTAtencionMin,
          PromTRingingSeg: employee.PromTRingingSeg,
          QdeEncuestas: employee.QdeEncuestas,
          NPS: employee.NPS,
          SAT: employee.SAT,
          RD: employee.RD,
          DiasLogueado: employee.DiasLogueado,
          PromLogueo: employee.PromLogueo,
          PorcentajeReady: employee.PorcentajeReady,
          PorcentajeACD: employee.PorcentajeACD,
          PorcentajeNoDispTotal: employee.PorcentajeNoDispTotal,
          PorcentajeNoDispNoProductivo: employee.PorcentajeNoDispNoProductivo,
          PorcentajeNoDispProductivo: employee.PorcentajeNoDispProductivo,
          PromedioCalidad: employee.PromedioCalidad,
          EvActitudinal: employee.EvActitudinal,
          PromLlamXHora: employee.PromLlamXHora,
          Priorizacion: employee.Priorizacion
        };
        await insertEmployeeMetric(mappedEmployee);
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

  const renderOverallMetrics = () => {
    if (employees.length === 0) return null;

    const averageNPS = employees.reduce((sum, employee) => sum + employee.NPS, 0) / employees.length;
    const averageSAT = employees.reduce((sum, employee) => sum + employee.SAT, 0) / employees.length;
    const averageRD = employees.reduce((sum, employee) => sum + employee.RD, 0) / employees.length;
    const totalAtendidas = employees.reduce((sum, employee) => sum + employee.Atendidas, 0);
    const averageCalidad = employees.reduce((sum, employee) => sum + employee.PromedioCalidad, 0) / employees.length;

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Promedio NPS" value={averageNPS.toFixed(2)} />
        <MetricCard title="Promedio SAT" value={`${averageSAT.toFixed(2)}%`} />
        <MetricCard title="Promedio RD" value={`${averageRD.toFixed(2)}%`} />
        <MetricCard title="Total Atendidas" value={totalAtendidas} />
        <MetricCard title="Promedio Calidad" value={averageCalidad.toFixed(2)} />
      </div>
    );
  };

  const renderMetricsTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Atendidas</TableHead>
            <TableHead>NPS</TableHead>
            <TableHead>SAT</TableHead>
            <TableHead>RD</TableHead>
            <TableHead>Promedio Calidad</TableHead>
            <TableHead>% de Ready</TableHead>
            <TableHead>% de ACD</TableHead>
            <TableHead>% de No Disp. Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee, index) => (
            <TableRow key={index}>
              <TableCell>{employee.nombre}</TableCell>
              <TableCell>{employee.Atendidas}</TableCell>
              <TableCell>{employee.NPS}</TableCell>
              <TableCell>{employee.SAT}%</TableCell>
              <TableCell>{employee.RD}%</TableCell>
              <TableCell>{employee.PromedioCalidad}</TableCell>
              <TableCell>{employee.PorcentajeReady}%</TableCell>
              <TableCell>{employee.PorcentajeACD}%</TableCell>
              <TableCell>{employee.PorcentajeNoDispTotal}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Métricas Mensuales</h1>
      
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

      {employees.length > 0 && (
        <>
          {renderOverallMetrics()}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumen de Métricas por Empleado</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMetricsTable()}
            </CardContent>
          </Card>
        </>
      )}

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
};

export default CallCenterDashboard;