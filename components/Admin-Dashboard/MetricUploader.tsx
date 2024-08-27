import React, { useState } from 'react';
import { parseCSV as parseNPSDiario } from './nps-diario';
import { parseCSV as parseMetricasTrimestral } from './trimestral-admin';
import { parseCSV as parseMetricasMensuales } from '@/lib/excelParser';
import { insertNPSDiario, clearNPSDiario, insertTrimestralMetric, insertEmployeeMetric, createOrUpdateEmployeeMetricsTable } from '@/utils/database';

// Define the interface for NPSDiario metrics
interface NPSDiarioMetric {
  employeeName: string;
  date: string;
  Q: number;
  NPS: number;
  CSAT: number | null;
  RD: number;
}

export const MetricUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metricType, setMetricType] = useState<string>('NPSDiario');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleMetricTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMetricType(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsSaving(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          if (metricType === 'NPSDiario') {
            const date = new Date().toISOString().split('T')[0]; // Use current date
            const parsedData = parseNPSDiario(content);
            await clearNPSDiario();
            for (const metric of parsedData) {
              await insertNPSDiario({
                employeeName: metric.employeeName,
                date: date,
                Q: metric.Q,
                NPS: metric.NPS,
                SAT: metric.CSAT, // Map CSAT to SAT
                RD: metric.RD
              });
            }
          } else if (metricType === 'MetricasTrimestral') {
            const { employeeData } = parseMetricasTrimestral(content);
            for (const employee of employeeData) {
              for (const month in employee.metrics) {
                await insertTrimestralMetric({
                  employeeName: employee.nombre,
                  month,
                  ...employee.metrics[month]
                });
              }
            }
          } else if (metricType === 'MetricasMensuales') {
            await createOrUpdateEmployeeMetricsTable();
            const parsedData = parseMetricasMensuales(content);
            for (const employee of parsedData) {
              const mappedEmployee = {
                nombre: employee.nombre,
                Atendidas: Number(employee.Atendidas),
                TiempoAtencion: Number(employee.TiempoAtencion),
                PromTAtencionMin: Number(employee.PromTAtencionMin),
                PromTRingingSeg: Number(employee.PromTRingingSeg),
                QdeEncuestas: Number(employee.QdeEncuestas),
                NPS: Number(employee.NPS),
                SAT: Number(employee.SAT),
                RD: Number(employee.RD),
                DiasLogueado: Number(employee.DiasLogueado),
                PromLogueo: employee.PromLogueo,
                PorcentajeReady: Number(employee.PorcentajeReady),
                PorcentajeACD: Number(employee.PorcentajeACD),
                PorcentajeNoDispTotal: Number(employee.PorcentajeNoDispTotal),
                PorcentajeNoDispNoProductivo: Number(employee.PorcentajeNoDispNoProductivo),
                PorcentajeNoDispProductivo: Number(employee.PorcentajeNoDispProductivo),
                PromedioCalidad: Number(employee.PromedioCalidad),
                EvActitudinal: employee.EvActitudinal,
                PromLlamXHora: Number(employee.PromLlamXHora),
                Priorizacion: employee.Priorizacion
              };
              await insertEmployeeMetric(mappedEmployee);
            }
          }
          alert('Data updated successfully!');
        } catch (error) {
          console.error('Error updating data:', error);
          alert('Error updating data. Please try again.');
        } finally {
          setIsSaving(false);
        }
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cargar Métricas</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="metricFile" className="block text-sm font-medium text-gray-700">
            Archivo de Métricas
          </label>
          <input
            type="file"
            id="metricFile"
            name="metricFile"
            onChange={handleFileChange}
            accept=".csv"
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
            value={metricType}
            onChange={handleMetricTypeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="NPSDiario">NPS Diario</option>
            <option value="MetricasTrimestral">Métricas Trimestrales</option>
            <option value="MetricasMensuales">Métricas Mensuales</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={!file || isSaving}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSaving ? 'Cargando...' : 'Cargar Métrica'}
        </button>
      </form>
    </div>
  );
};