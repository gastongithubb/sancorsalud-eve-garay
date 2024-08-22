'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clearNPSDiario, insertNPSDiario, getNPSDiario } from '@/utils/database';

interface EmployeeData {
  employeeName: string;
  date: string;
  Q: number;
  NPS: number;
  SAT: number;
  RD: number;
}

export const parseCSV = (csv: string, date: string): EmployeeData[] => {
  const lines = csv.split('\n');
  const data: EmployeeData[] = [];

  lines.slice(1).forEach(line => {
    const [employeeName, Q, NPS, CSAT, _, RD] = line.split(';');
    if (employeeName && employeeName !== "Equipo ") {
      data.push({
        employeeName,
        date,
        Q: parseInt(Q),
        NPS: parseInt(NPS),
        SAT: parseFloat(CSAT.replace('%', '')),
        RD: parseFloat(RD.replace('%', ''))
      });
    }
  });

  return data;
}

const NPSDiarioDashboard: React.FC = () => {
  const [csvData, setCsvData] = useState<EmployeeData[]>([]);
  const [dbData, setDbData] = useState<EmployeeData[]>([]);
  const [date, setDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDataFromDb();
  }, []);

  const loadDataFromDb = async () => {
    try {
      const metrics = await getNPSDiario();
      setDbData(metrics);
      if (metrics.length > 0) {
        setDate(metrics[0].date);
      }
    } catch (error) {
      console.error('Error loading data from database:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const lines = content.split('\n');
          const newDate = lines[0].split(';')[0];
          setDate(newDate);
          const parsedData = parseCSV(content, newDate);
          setCsvData(parsedData);
        }
      };
      reader.readAsText(file);
    }
  };

  const saveToDatabase = async () => {
    if (csvData.length === 0) return;

    setIsSaving(true);
    try {
      await clearNPSDiario();

      for (const metric of csvData) {
        await insertNPSDiario(metric);
      }
      alert('Data updated successfully!');
      loadDataFromDb();
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayData = csvData.length > 0 ? csvData : dbData;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">NPS Diario Dashboard</h1>
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".csv"
        className="mb-4 p-2 border rounded"
      />
      {csvData.length > 0 && (
        <button
          onClick={saveToDatabase}
          disabled={isSaving}
          className="mb-4 p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isSaving ? 'Updating...' : 'Update Database'}
        </button>
      )}
      {date && <h2 className="text-2xl font-semibold mb-4">{date}</h2>}
      {displayData.length > 0 && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="employeeName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="NPS" fill="#8884d8" />
                  <Bar dataKey="SAT" fill="#82ca9d" />
                  <Bar dataKey="RD" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Q</TableHead>
                <TableHead>NPS</TableHead>
                <TableHead>SAT</TableHead>
                <TableHead>RD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>{employee.employeeName}</TableCell>
                  <TableCell>{employee.Q}</TableCell>
                  <TableCell>{employee.NPS}</TableCell>
                  <TableCell>{employee.SAT.toFixed(1)}%</TableCell>
                  <TableCell>{employee.RD.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default NPSDiarioDashboard;