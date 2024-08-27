import React, { useState, useEffect, useCallback } from 'react';
import { getEmployeeScores, insertEmployeeScore } from '@/utils/database';
import { Button } from "@/components/ui/button";
import { Tab } from '@headlessui/react';
import SancorSaludLoading from '@/components/loading'

interface EmployeeData {
  email: string;
  name: string;
  weeks: {
    [key in 'SEMANA 1' | 'SEMANA 2' | 'SEMANA 3']: string;
  };
  scores: {
    [key in 'SEMANA 1' | 'SEMANA 2' | 'SEMANA 3']: string;
  };
}

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const initialEmployees: EmployeeData[] = [
  { email: "franco.alvarez@sancor.konecta.ar", name: "Alvarez Falco Franco Gabriel", weeks: { "SEMANA 1": "Primer llamada", "SEMANA 2": "Sexta llamada", "SEMANA 3": "Sexta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "gaston.alvarez@sancor.konecta.ar", name: "Alvarez Gastón", weeks: { "SEMANA 1": "Tercer llamada", "SEMANA 2": "Quinta llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "karen.aranda@sancor.konecta.ar", name: "Aranda Karen Tamara", weeks: { "SEMANA 1": "Ultima llamada", "SEMANA 2": "Ultima llamada", "SEMANA 3": "Primer llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "jeremias.britos@sancor.konecta.ar", name: "BRITOS FLORES JEREMIAS ARIEL", weeks: { "SEMANA 1": "Septima llamada", "SEMANA 2": "Sexta llamada", "SEMANA 3": "Primer llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "lautaro.brocal@sancor.konecta.ar", name: "BROCAL LAUTARO IVAN", weeks: { "SEMANA 1": "Tercer llamada", "SEMANA 2": "Tercer llamada", "SEMANA 3": "Septima llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "antonella.casas@sancor.konecta.ar", name: "CASAS ANTONELLA", weeks: { "SEMANA 1": "Sexta llamada", "SEMANA 2": "Tercer llamada", "SEMANA 3": "Cuarta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "karen.chavez@sancor.konecta.ar", name: "Chavez Karen Yamila", weeks: { "SEMANA 1": "Quinta llamada", "SEMANA 2": "Sexta llamada", "SEMANA 3": "Septima llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "macarena.gomez@sancor.konecta.ar", name: "Gomez Macarena", weeks: { "SEMANA 1": "Ultima llamada", "SEMANA 2": "Sexta llamada", "SEMANA 3": "Primer llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "auca.heil@sancor.konecta.ar", name: "Heil Auca Matias", weeks: { "SEMANA 1": "Septima llamada", "SEMANA 2": "Quinta llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "ismael.iriarte@sancor.konecta.ar", name: "Iriarte Ismael Agustin Andres", weeks: { "SEMANA 1": "Sexta llamada", "SEMANA 2": "Quinta llamada", "SEMANA 3": "Septima llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "milagros.juncos@sancor.konecta.ar", name: "Juncos Milagros Anahi", weeks: { "SEMANA 1": "Ultima llamada", "SEMANA 2": "Ultima llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "leonardo.macagno@sancor.konecta.ar", name: "MACAGNO LEONARDO NICOLAS", weeks: { "SEMANA 1": "Llamada nº10", "SEMANA 2": "Tercer llamada", "SEMANA 3": "Septima llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "victoria.martinez@sancor.konecta.ar", name: "Martinez Victoria", weeks: { "SEMANA 1": "Septima llamada", "SEMANA 2": "Primer llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "mauricio.mena@sancor.konecta.ar", name: "Mena Lerda Mauricio Emanuel", weeks: { "SEMANA 1": "Septima llamada", "SEMANA 2": "Septima llamada", "SEMANA 3": "Ultima llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "marcos.montenegro@sancor.konecta.ar", name: "MONTENEGRO MARCOS JOEL", weeks: { "SEMANA 1": "Sexta llamada", "SEMANA 2": "Quinta llamada", "SEMANA 3": "Septima llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "yohana.montenegro@sancor.konecta.ar", name: "MONTENEGRO YOHANA VANESSA", weeks: { "SEMANA 1": "Ultima llamada", "SEMANA 2": "Septima llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "aldana.poccetti@sancor.konecta.ar", name: "POCCETTI ALDANA BELEN", weeks: { "SEMANA 1": "Llamada nº10", "SEMANA 2": "Primer llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "angel.rodriguez@sancor.konecta.ar", name: "RODRIGUEZ ANGEL JAVIER", weeks: { "SEMANA 1": "Primer llamada", "SEMANA 2": "Quinta llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "agustin.suarez@sancor.konecta.ar", name: "SUAREZ PEDERNERA AGUSTIN", weeks: { "SEMANA 1": "Sexta llamada", "SEMANA 2": "Ultima llamada", "SEMANA 3": "Quinta llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "maria.veyga@sancor.konecta.ar", name: "Veyga Hanigian Maria Abigail", weeks: { "SEMANA 1": "Ultima llamada", "SEMANA 2": "Quinta llamada", "SEMANA 3": "Septima llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
  { email: "pablo.vijarra@sancor.konecta.ar", name: "VIJARRA PABLO SEBASTIAN", weeks: { "SEMANA 1": "Ultima llamada", "SEMANA 2": "Primer llamada", "SEMANA 3": "Primer llamada" }, scores: { "SEMANA 1": "", "SEMANA 2": "", "SEMANA 3": "" } },
];

const EmployeeScores: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<{ [month: string]: EmployeeData[] }>({});
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStoredScores = useCallback(async () => {
    setLoading(true);
    try {
      const allData: { [month: string]: EmployeeData[] } = {};
      for (const month of months) {
        const scores = await getEmployeeScores('', month);
        allData[month] = initialEmployees.map(employee => ({
          ...employee,
          scores: {
            "SEMANA 1": scores.find(score => score.email === employee.email && score.week === `SEMANA 1 ${month}`)?.score?.toString() || "",
            "SEMANA 2": scores.find(score => score.email === employee.email && score.week === `SEMANA 2 ${month}`)?.score?.toString() || "",
            "SEMANA 3": scores.find(score => score.email === employee.email && score.week === `SEMANA 3 ${month}`)?.score?.toString() || "",
          }
        }));
      }
      setEmployeeData(allData);
    } catch (err) {
      console.error('Error fetching stored scores:', err);
      setError('Failed to fetch stored scores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoredScores();
  }, [fetchStoredScores]);

  const handleScoreChange = (month: string, employeeIndex: number, week: 'SEMANA 1' | 'SEMANA 2' | 'SEMANA 3', value: string) => {
    setEmployeeData(prev => ({
      ...prev,
      [month]: prev[month].map((employee, index) => 
        index === employeeIndex
          ? { ...employee, scores: { ...employee.scores, [week]: value } }
          : employee
      )
    }));
  };

  const handleSave = async (month: string) => {
    try {
      for (const employee of employeeData[month]) {
        for (const week of ['SEMANA 1', 'SEMANA 2', 'SEMANA 3'] as const) {
          await insertEmployeeScore({
            email: employee.email,
            name: employee.name,
            month: month,
            week: `${week} ${month}`,
            call: employee.weeks[week],
            score: parseFloat(employee.scores[week]) || 0
          });
        }
      }
      alert(`Datos guardados exitosamente para ${month}`);
    } catch (err) {
      console.error('Error saving data:', err);
      alert(`Error al guardar los datos para ${month}`);
    }
  };

  if (loading) return <SancorSaludLoading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <Tab.Group selectedIndex={selectedMonth} onChange={setSelectedMonth}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          {months.map((month) => (
            <Tab
              key={month}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                 ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              {month}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {months.map((month) => (
            <Tab.Panel key={month}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEMANA 1</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota 1</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEMANA 2</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota 2</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEMANA 3</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota 3</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeData[month]?.map((employee, index) => (
                    <tr key={employee.email}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                      {(['SEMANA 1', 'SEMANA 2', 'SEMANA 3'] as const).map((week) => (
                        <React.Fragment key={week}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.weeks[week]}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="number"
                              value={employee.scores[week]}
                              onChange={(e) => handleScoreChange(month, index, week, e.target.value)}
                              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button onClick={() => handleSave(month)} className="mt-4">
                Guardar datos de {month}
              </Button>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default EmployeeScores;