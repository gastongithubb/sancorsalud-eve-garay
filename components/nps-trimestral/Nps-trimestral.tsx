'use client'

import React, { useState, useEffect } from 'react';
import { getTrimestralMetrics } from '@/utils/database';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrimestralMetric {
  id: number;
  employeeName: string;
  month: string;
  Q: number;
  NPS: number;
  SAT: number;
  RD: number;
}

const MONTHS = ['MAYO', 'JUNIO', 'JULIO'];

const TrimestralMetricsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<TrimestralMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const allMetrics = await Promise.all(
          MONTHS.map(month => getTrimestralMetrics(month))
        );
        setMetrics(allMetrics.flat());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to fetch metrics. Please try again later.');
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const groupMetricsByEmployee = (metrics: TrimestralMetric[]) => {
    return metrics.reduce((acc, metric) => {
      if (!acc[metric.employeeName]) {
        acc[metric.employeeName] = {};
      }
      acc[metric.employeeName][metric.month] = metric;
      return acc;
    }, {} as Record<string, Record<string, TrimestralMetric>>);
  };

  const groupedMetrics = groupMetricsByEmployee(metrics);

  const renderMetricsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          {MONTHS.map(month => (
            <TableHead key={month}>{month}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(groupedMetrics).map(([employeeName, monthlyMetrics]) => (
          <TableRow key={employeeName}>
            <TableCell>{employeeName}</TableCell>
            {MONTHS.map(month => (
              <TableCell key={month}>
                {monthlyMetrics[month] ? (
                  <>
                    <div>Q: {monthlyMetrics[month].Q}</div>
                    <div>NPS: {monthlyMetrics[month].NPS}</div>
                    <div>SAT: {monthlyMetrics[month].SAT.toFixed(2)}%</div>
                    <div>RD: {monthlyMetrics[month].RD.toFixed(2)}%</div>
                  </>
                ) : (
                  'N/A'
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderMetricsChart = (employeeName: string, monthlyMetrics: Record<string, TrimestralMetric>) => {
    const chartData = MONTHS.map(month => ({
      name: month,
      NPS: monthlyMetrics[month]?.NPS || 0,
      SAT: monthlyMetrics[month]?.SAT || 0,
      RD: monthlyMetrics[month]?.RD || 0,
    }));

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{employeeName}</CardTitle>
        </CardHeader>
        <CardContent>
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Trimestral Metrics Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Metrics Table</CardTitle>
        </CardHeader>
        <CardContent>
          {renderMetricsTable()}
        </CardContent>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Employee Charts</h2>
      {Object.entries(groupedMetrics).map(([employeeName, monthlyMetrics]) => (
        renderMetricsChart(employeeName, monthlyMetrics)
      ))}
    </div>
  );
};

export default TrimestralMetricsPage;