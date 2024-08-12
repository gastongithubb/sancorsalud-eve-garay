'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { insertTrimestralMetric, getTrimestralMetrics, createTrimestralMetricsTable } from '@/utils/database';

const MONTHS = ['MAYO', 'JUNIO', 'JULIO'];

interface EmployeeData {
  nombre: string;
  metrics: {
    [month: string]: {
      Q: number;
      NPS: number;
      SAT: number;
      RD: number;
    };
  };
}

interface CalidadData {
  nombre: string;
  [month: string]: string | number;
}

const parseCSV = (csv: string) => {
  const lines = csv.split('\n');
  const employeeData: EmployeeData[] = [];
  const calidadData: CalidadData[] = [];

  let currentSection = '';

  lines.forEach((line, index) => {
    const columns = line.split(',');

    if (columns[0] === 'Nombre' && columns[1] === 'Q de resp') {
      currentSection = 'monthlyMetrics';
    } else if (columns[0] === 'CALIDAD por Sancor') {
      currentSection = 'calidad';
    } else if (columns[0] === 'NPS' && columns[1] === 'Cierre Junio') {
      currentSection = 'npsJulioJunio';
    }

    if (currentSection === 'monthlyMetrics' && columns[0] && columns[0] !== 'Nombre') {
      const employee: EmployeeData = {
        nombre: columns[0],
        metrics: {}
      };

      MONTHS.forEach((month, i) => {
        const offset = i * 4;
        employee.metrics[month] = {
          Q: parseInt(columns[1 + offset]) || 0,
          NPS: parseInt(columns[2 + offset]) || 0,
          SAT: parseFloat(columns[3 + offset]) || 0,
          RD: parseFloat(columns[4 + offset]) || 0,
        };
      });

      employeeData.push(employee);
    } else if (currentSection === 'calidad' && columns[0] && columns[0] !== 'CALIDAD por Sancor') {
      const calidad: CalidadData = {
        nombre: columns[0],
        MARZO: columns[1],
        ABRIL: columns[2],
        MAYO: columns[3],
        JUNIO: columns[4]
      };
      calidadData.push(calidad);
    }
  });

  return { employeeData, calidadData };
};

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

const EmployeeMetrics: React.FC<{ employee: EmployeeData }> = ({ employee }) => {
  const chartData = MONTHS.map(month => ({
    name: month,
    NPS: employee.metrics[month].NPS,
    SAT: employee.metrics[month].SAT,
    RD: employee.metrics[month].RD
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{employee.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {MONTHS.map(month => (
            <div key={month}>
              <h3 className="text-lg font-semibold mb-2">{month}</h3>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard title="Q de resp" value={employee.metrics[month].Q} />
                <MetricCard title="NPS" value={employee.metrics[month].NPS} />
                <MetricCard title="SAT" value={`${employee.metrics[month].SAT}%`} />
                <MetricCard title="RD" value={`${employee.metrics[month].RD}%`} />
              </div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="NPS" stroke="#8884d8" />
            <Line type="monotone" dataKey="SAT" stroke="#82ca9d" />
            <Line type="monotone" dataKey="RD" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const CalidadTable: React.FC<{ calidadData: CalidadData[] }> = ({ calidadData }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Calidad por Sancor</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>MARZO</TableHead>
            <TableHead>ABRIL</TableHead>
            <TableHead>MAYO</TableHead>
            <TableHead>JUNIO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calidadData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.MARZO}</TableCell>
              <TableCell>{row.ABRIL}</TableCell>
              <TableCell>{row.MAYO}</TableCell>
              <TableCell>{row.JUNIO}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const MetricasTrimestralDashboard: React.FC = () => {
  const [csvData, setCsvData] = useState<{ employeeData: EmployeeData[], calidadData: CalidadData[] } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    createTrimestralMetricsTable();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const parsedData = parseCSV(content);
          setCsvData(parsedData);
        }
      };
      reader.readAsText(file);
    }
  };

  const saveToDatabase = async () => {
    if (!csvData) return;

    setIsSaving(true);
    try {
      for (const employee of csvData.employeeData) {
        for (const month of MONTHS) {
          await insertTrimestralMetric({
            employeeName: employee.nombre,
            month,
            Q: employee.metrics[month].Q,
            NPS: employee.metrics[month].NPS,
            SAT: employee.metrics[month].SAT,
            RD: employee.metrics[month].RD,
          });
        }
      }
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Métricas Trimestrales Dashboard</h1>
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".csv"
        className="mb-4 p-2 border rounded"
      />
      {csvData && (
        <button
          onClick={saveToDatabase}
          disabled={isSaving}
          className="mb-4 p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save to Database'}
        </button>
      )}
      {csvData && (
        <>
          <CalidadTable calidadData={csvData.calidadData} />
          {csvData.employeeData.map((employee, index) => (
            <EmployeeMetrics key={index} employee={employee} />
          ))}
        </>
      )}
    </div>
  );
};

export default MetricasTrimestralDashboard;