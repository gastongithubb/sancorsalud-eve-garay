import React, { useEffect, useState } from 'react';
import { getUploadedFiles, UploadedFileRow } from '@/utils/database';

export default function ViewData() {
  const [data, setData] = useState<UploadedFileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const uploadedFiles = await getUploadedFiles();
        setData(uploadedFiles);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Cargando datos...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Archivos Subidos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre del Archivo</th>
              <th className="px-4 py-2 border">Tipo de Archivo</th>
              <th className="px-4 py-2 border">Ruta del Archivo</th>
              <th className="px-4 py-2 border">Fecha de Subida</th>
              <th className="px-4 py-2 border">ID del Personal</th>
              <th className="px-4 py-2 border">Datos Procesados</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.fileName}</td>
                <td className="border px-4 py-2">{item.fileType}</td>
                <td className="border px-4 py-2">{item.filePath}</td>
                <td className="border px-4 py-2">{item.uploadDate}</td>
                <td className="border px-4 py-2">{item.personnelId}</td>
                <td className="border px-4 py-2">{item.processedData ? 'Procesado' : 'No procesado'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}