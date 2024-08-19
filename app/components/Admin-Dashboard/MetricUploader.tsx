// components/MetricUploader.tsx
import React from 'react';

export const MetricUploader: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cargar Métricas</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="metricFile" className="block text-sm font-medium text-gray-700">
            Archivo de Métricas
          </label>
          <input
            type="file"
            id="metricFile"
            name="metricFile"
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label htmlFor="metricType" className="block text-sm font-medium text-gray-700">
            Tipo de Métrica
          </label>
          <select
            id="metricType"
            name="metricType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option>Balance Mensual</option>
            <option>Métricas Trimestrales</option>
            <option>NPS Diario</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cargar Métrica
        </button>
      </form>
    </div>
  );
};