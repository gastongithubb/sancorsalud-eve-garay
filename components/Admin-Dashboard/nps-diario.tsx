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
  CSAT: number | null;
  CES: number | null;
  RD: number;
}

export const parseCSV = (csv: string): EmployeeData[] => {
  const lines = csv.split('\n');
  const data: EmployeeData[] = [];
  const dateMatch = lines[0].match(/Data (.+)/);
  const date = dateMatch ? dateMatch[1] : 'Unknown Date';

  lines.slice(1).forEach(line => {
    const [employeeName, Q, NPS, CSAT, CES, RD] = line.split(',');
    if (employeeName && employeeName !== "Equipo") {
      data.push({
        employeeName,
        date,
        Q: parseInt(Q) || 0,
        NPS: parseInt(NPS) || 0,
        CSAT: CSAT ? parseFloat(CSAT.replace('%', '')) : null,
        CES: CES ? parseFloat(CES.replace('%', '')) : null,
        RD: parseFloat(RD.replace('%', '')) || 0
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDataFromDb();
  }, []);

  const loadDataFromDb = async () => {
    try {
      const metrics = await getNPSDiario();
      setDbData(metrics.map(metric => ({
        employeeName: metric.employeeName,
        date: metric.date,
        Q: metric.Q,
        NPS: metric.NPS,
        CSAT: metric.SAT,
        CES: null,
        RD: metric.RD
      })));
      if (metrics.length > 0) {
        setDate(metrics[0].date);
      }
    } catch (error) {
      console.error('Error loading data from database:', error);
      setError('Error loading data from database. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const parsedData = parseCSV(content);
          setCsvData(parsedData);
          if (parsedData.length > 0) {
            setDate(parsedData[0].date);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const saveToDatabase = async () => {
    if (csvData.length === 0) return;

    setIsSaving(true);
    setError(null);
    try {
      await clearNPSDiario();

      for (const metric of csvData) {
        await insertNPSDiario({
          employeeName: metric.employeeName,
          date: metric.date,
          Q: metric.Q,
          NPS: metric.NPS,
          SAT: metric.CSAT ?? 0, // Use 0 as default if CSAT is null
          RD: metric.RD
        });
      }
      alert('Data updated successfully!');
      loadDataFromDb();
    } catch (error) {
      console.error('Error updating data:', error);
      setError(`Error updating data: ${error instanceof Error ? error.message : String(error)}`);
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
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
                  <Bar dataKey="CSAT" fill="#82ca9d" />
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
                <TableHead>CSAT</TableHead>
                <TableHead>CES</TableHead>
                <TableHead>RD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>{employee.employeeName}</TableCell>
                  <TableCell>{employee.Q}</TableCell>
                  <TableCell>{employee.NPS}</TableCell>
                  <TableCell>{employee.CSAT !== null ? `${employee.CSAT.toFixed(1)}%` : 'N/A'}</TableCell>
                  <TableCell>{employee.CES !== null ? `${employee.CES.toFixed(1)}%` : 'N/A'}</TableCell>
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