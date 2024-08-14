'use client'

import React, { useState, useEffect } from 'react';
import { getPersonnel, MonthlyData } from '@/utils/database';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyComparison: React.FC = () => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ [month: string]: MonthlyData[] }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      const data: { [month: string]: MonthlyData[] } = {};
      for (const month of selectedMonths) {
        try {
          const personnelData = await getPersonnel(month);
          if (personnelData.length === 0) {
            console.warn(`No data found for ${month}`);
          }
          data[month] = personnelData;
        } catch (err) {
          console.error(`Error fetching data for ${month}:`, err);
          setError(`Failed to fetch data for ${month}`);
        }
      }
      setMonthlyData(data);
    };

    if (selectedMonths.length > 0) {
      fetchData();
    }
  }, [selectedMonths]);

  const handleMonthSelect = (month: string) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else if (selectedMonths.length < 3) {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const getAverageMetrics = (data: MonthlyData[]): { nps: number; csat: number; rd: number } => {
    if (data.length === 0) return { nps: 0, csat: 0, rd: 0 };
    const sum = data.reduce((acc, curr) => ({
      nps: acc.nps + curr.nps,
      csat: acc.csat + curr.csat,
      rd: acc.rd + curr.rd
    }), { nps: 0, csat: 0, rd: 0 });

    return {
      nps: Number((sum.nps / data.length).toFixed(2)),
      csat: Number((sum.csat / data.length).toFixed(2)),
      rd: Number((sum.rd / data.length).toFixed(2))
    };
  };

  const compareData = selectedMonths.map(month => ({
    month,
    ...getAverageMetrics(monthlyData[month] || [])
  }));

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Comparación Mensual</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-green-600">Seleccione hasta 3 meses para comparar:</h2>
        <div className="flex flex-wrap gap-2">
          {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(month)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedMonths.includes(month)
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-blue-500 hover:bg-blue-100'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</div>}

      {compareData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="nps" fill="#1e40af" name="NPS" />
              <Bar dataKey="csat" fill="#047857" name="CSAT" />
              <Bar dataKey="rd" fill="#0ea5e9" name="RD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-gray-500 bg-white p-4 rounded-lg shadow">No hay datos para mostrar. Por favor, seleccione al menos un mes.</div>
      )}
    </div>
  );
};

export default MonthlyComparison;