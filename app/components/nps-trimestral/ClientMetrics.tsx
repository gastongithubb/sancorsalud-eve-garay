'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserRow } from '@/utils/db';
import NPSTrimestral from './Nps-trimestral';

const ClientMetrics: React.FC = () => {
  const [user, setUser] = useState<UserRow | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/nps-trimestral');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError('Error al cargar datos del usuario');
      console.error('Error fetching user data:', err);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/trimestral', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      setIsEditing(false);
      fetchUserData();  // Refetch to ensure we have the latest data

      // Actualizar datos trimestrales
      await updateTrimestralNPS(user.id, user.nps);
    } catch (err) {
      setError('Error al actualizar datos del usuario');
      console.error('Error updating user data:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const { name, value } = e.target;
    setUser(prev => prev ? { ...prev, [name]: parseInt(value, 10) } : null);
  };

  const updateTrimestralNPS = async (userId: number, nps: number) => {
    try {
      const response = await fetch('/api/nps-trimestral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, nps }),
      });

      if (!response.ok) {
        throw new Error('Failed to update trimestral NPS');
      }
    } catch (err) {
      console.error('Error updating trimestral NPS:', err);
    }
  };

  if (!user) {
    return <div>Cargando datos del usuario...</div>;
  }

  const data = [
    { name: 'NPS', value: user.nps },
    { name: 'CSAT', value: user.csat },
    { name: 'RD', value: user.rd },
    { name: 'Respuestas', value: user.responses },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">Mis Métricas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {isEditing ? (
          <>
            <input type="number" name="nps" value={user.nps} onChange={handleChange} className="border p-2 rounded" placeholder="NPS" />
            <input type="number" name="csat" value={user.csat} onChange={handleChange} className="border p-2 rounded" placeholder="CSAT" />
            <input type="number" name="rd" value={user.rd} onChange={handleChange} className="border p-2 rounded" placeholder="RD" />
            <input type="number" name="responses" value={user.responses} onChange={handleChange} className="border p-2 rounded" placeholder="Respuestas" />
            <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded col-span-2">Guardar</button>
          </>
        ) : (
          <>
            <p className="font-semibold">NPS: {user.nps}</p>
            <p className="font-semibold">CSAT: {user.csat}</p>
            <p className="font-semibold">RD: {user.rd}</p>
            <p className="font-semibold">Respuestas: {user.responses}</p>
            <button onClick={handleEdit} className="bg-blue-500 text-white p-2 rounded col-span-2">Editar</button>
          </>
        )}
      </div>
      {user.id && <NPSTrimestral userId={user.id} />}
    </div>
  );
};

export default ClientMetrics;