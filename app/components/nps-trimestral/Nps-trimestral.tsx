'use client'
import React, { useState, useEffect } from 'react';
import { getPersonnel, MonthlyData } from '@/utils/database';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyComparison: React.FC = () => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ [month: string]: MonthlyData[] }>({});

  useEffect(() => {
    const fetchData = async () => {
      const data: { [month: string]: MonthlyData[] } = {};
      for (const month of selectedMonths) {
        data[month] = await getPersonnel(month);
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
    const sum = data.reduce((acc, curr) => ({
      nps: acc.nps + curr.nps,
      csat: acc.csat + curr.csat,
      rd: acc.rd + curr.rd
    }), { nps: 0, csat: 0, rd: 0 });

    return {
      nps: sum.nps / data.length,
      csat: sum.csat / data.length,
      rd: sum.rd / data.length
    };
  };

  const compareData = selectedMonths.map(month => ({
    month,
    ...getAverageMetrics(monthlyData[month] || [])
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Monthly Comparison</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select up to 3 months to compare:</h2>
        <div className="flex flex-wrap gap-2">
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(month)}
              className={`px-4 py-2 rounded ${
                selectedMonths.includes(month)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {compareData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nps" fill="#8884d8" name="NPS" />
              <Bar dataKey="csat" fill="#82ca9d" name="CSAT" />
              <Bar dataKey="rd" fill="#ffc658" name="RD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthlyComparison;