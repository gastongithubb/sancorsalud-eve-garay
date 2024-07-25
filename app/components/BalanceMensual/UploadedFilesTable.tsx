// app/components/BalanceMensual/UploadedFilesTable.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface EmployeeData {
  name: string;
  atendidas?: number;
  tiempoAtencion?: number;
  promTAtencion?: number;
  promTRinging?: number;
  qDeEncuestas?: number;
  nps?: number;
  sat?: number;
  rd?: number;
  diasLogueado?: number;
  promLogueo?: string;
  porcentajeReady?: number;
  porcentajeACD?: number;
  porcentajeNoDispTotal?: number;
  porcentajeNoDispProductivo?: number;
}

const UploadedFilesTable: React.FC = () => {
  const [data, setData] = useState<EmployeeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/get-uploaded-files');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">GENERAL</th>
            <th className="py-2 px-4 border-b">Atendidas</th>
            <th className="py-2 px-4 border-b">Tiempo Atencion</th>
            <th className="py-2 px-4 border-b">Prom. T. Atención (min)</th>
            <th className="py-2 px-4 border-b">Prom. T Ringing (seg)</th>
            <th className="py-2 px-4 border-b">Q de Encuestas</th>
            <th className="py-2 px-4 border-b">NPS</th>
            <th className="py-2 px-4 border-b">SAT</th>
            <th className="py-2 px-4 border-b">RD</th>
            <th className="py-2 px-4 border-b">Días Logueado</th>
            <th className="py-2 px-4 border-b">Prom. Logueo</th>
            <th className="py-2 px-4 border-b">% de Ready</th>
            <th className="py-2 px-4 border-b">% de ACD</th>
            <th className="py-2 px-4 border-b">% de No Disp. Total</th>
            <th className="py-2 px-4 border-b">% No Disp. Productivo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
              <td className="py-2 px-4 border-b">{employee.name}</td>
              <td className="py-2 px-4 border-b">{employee.atendidas ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.tiempoAtencion ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.promTAtencion?.toFixed(1) ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.promTRinging?.toFixed(1) ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.qDeEncuestas ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.nps ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.sat != null ? `${employee.sat}%` : 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.rd != null ? `${employee.rd}%` : 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.diasLogueado ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.promLogueo ?? 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.porcentajeReady != null ? `${employee.porcentajeReady}%` : 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.porcentajeACD != null ? `${employee.porcentajeACD}%` : 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.porcentajeNoDispTotal != null ? `${employee.porcentajeNoDispTotal}%` : 'N/A'}</td>
              <td className="py-2 px-4 border-b">{employee.porcentajeNoDispProductivo != null ? `${employee.porcentajeNoDispProductivo}%` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadedFilesTable;