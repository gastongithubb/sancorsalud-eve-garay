'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserNPSData {
  id: number;
  name: string;
  nps: number;
  csat: number;
  rd: number;
  responses: number;
}

const NPSDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserNPSData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserNPSData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserNPSData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsersData();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsersData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/nps-individual');
      if (!response.ok) {
        throw new Error('Failed to fetch users data');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users data:', error);
      setError('Error al cargar los datos de los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (user: UserNPSData) => {
    setEditingUser({...user});
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return;
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: parseInt(value, 10) });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/nps-individual/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Error al actualizar los datos del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (userData: UserNPSData) => {
    const data = [
      { name: 'NPS', value: userData.nps },
      { name: 'CSAT', value: userData.csat },
      { name: 'RD', value: userData.rd },
      { name: 'Respuestas', value: userData.responses },
    ];

    return (
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
    );
  };

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Métricas - NPS Individual</h1>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            {renderChart(user)}
            {editingUser && editingUser.id === user.id ? (
              <>
                <input type="number" name="nps" value={editingUser.nps} onChange={handleChange} className="border p-2 rounded mt-2 w-full" placeholder="NPS" />
                <input type="number" name="csat" value={editingUser.csat} onChange={handleChange} className="border p-2 rounded mt-2 w-full" placeholder="CSAT" />
                <input type="number" name="rd" value={editingUser.rd} onChange={handleChange} className="border p-2 rounded mt-2 w-full" placeholder="RD" />
                <input type="number" name="responses" value={editingUser.responses} onChange={handleChange} className="border p-2 rounded mt-2 w-full" placeholder="Respuestas" />
                <div className="flex justify-between mt-2">
                  <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded w-1/2 mr-1">Guardar</button>
                  <button onClick={handleCancel} className="bg-red-500 text-white p-2 rounded w-1/2 ml-1">Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <p>NPS: {user.nps}</p>
                <p>CSAT: {user.csat}</p>
                <p>RD: {user.rd}</p>
                <p>Respuestas: {user.responses}</p>
                <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white p-2 rounded mt-2 w-full">Editar</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NPSDashboard;