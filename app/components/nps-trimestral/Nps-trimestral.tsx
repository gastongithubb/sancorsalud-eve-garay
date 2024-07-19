'use client'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NPSTrimestralData {
  month: string;
  nps: number;
}

interface NPSTrimestralProps {
  userId: number;
}

const NPSTrimestral: React.FC<NPSTrimestralProps> = ({ userId }) => {
  const [trimestralData, setTrimestralData] = useState<NPSTrimestralData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrimestralData();
  }, [userId]);

  const fetchTrimestralData = async () => {
    try {
      const response = await fetch(`/api/nps-trimestral/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trimestral NPS data');
      }
      const data = await response.json();
      setTrimestralData(data);
    } catch (err) {
      setError('Error al cargar datos trimestrales de NPS');
      console.error('Error fetching trimestral NPS data:', err);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">NPS Trimestral</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={trimestralData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="nps" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NPSTrimestral;