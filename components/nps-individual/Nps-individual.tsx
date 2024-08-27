'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getNPSDiario } from '@/utils/database';
import SancorSaludLoading from '@/components/loading'


interface EmployeeData {
  employeeName: string;
  date: string;
  Q: number;
  NPS: number;
  SAT: number;
  RD: number;
}

const NPSDiarioView: React.FC = () => {
  const [data, setData] = useState<EmployeeData[]>([]);
  const [date, setDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDataFromDb();
  }, []);

  const loadDataFromDb = async () => {
    setIsLoading(true);
    try {
      const metrics = await getNPSDiario();
      setData(metrics);
      if (metrics.length > 0) {
        setDate(metrics[0].date);
      }
    } catch (error) {
      console.error('Error loading data from database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SancorSaludLoading />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">NPS Diario</h1>
      {date && <h2 className="text-2xl font-semibold mb-4">{date}</h2>}
      {data.length > 0 ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
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
              {data.map((employee, index) => (
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
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default NPSDiarioView;