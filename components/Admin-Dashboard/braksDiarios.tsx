import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clearBreaks, insertBreak, getBreaks } from '@/utils/database';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BreakData {
  id?: number;
  employeeName: string;
  date: string;
  breakTime: string;
  dayOfWeek?: string;  // Make dayOfWeek optional
}

const getDayOfWeek = (dateString: string): string => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const BreaksDashboard: React.FC = () => {
  const [allData, setAllData] = useState<BreakData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDataFromDb();
  }, []);

  const loadDataFromDb = async () => {
    try {
      const breaks = await getBreaks();
      const breakDataWithDayOfWeek = breaks.map(breakItem => ({
        ...breakItem,
        dayOfWeek: getDayOfWeek(breakItem.date)
      }));
      setAllData(breakDataWithDayOfWeek);
    } catch (error) {
      console.error('Error loading data from database:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          try {
            const jsonData = JSON.parse(content);
            const parsedData = jsonData.map((item: any) => ({
              employeeName: item['lunes, 19 de agosto de 2024'],
              date: item['lunes, 19 de agosto de 2024'],
              breakTime: item[''] || 'No asignado',
              dayOfWeek: getDayOfWeek(item['lunes, 19 de agosto de 2024'])
            })).filter((item: BreakData) => item.employeeName && item.employeeName !== 'Nombre');
            setAllData(parsedData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Error parsing JSON file. Please ensure it\'s a valid JSON format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const saveToDatabase = async () => {
    if (allData.length === 0) return;

    setIsSaving(true);
    try {
      await clearBreaks();
      for (const breakItem of allData) {
        await insertBreak(breakItem);
      }
      alert('Break data updated successfully!');
    } catch (error) {
      console.error('Error updating break data:', error);
      alert('Error updating break data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredData = allData.filter(item => 
    item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.dayOfWeek || '']) {
      acc[item.dayOfWeek || ''] = [];
    }
    acc[item.dayOfWeek || ''].push(item);
    return acc;
  }, {} as Record<string, BreakData[]>);

  const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Grupo Sancor</h1>
      <div className="mb-4 flex items-center gap-4">
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".json"
          className="flex-grow"
        />
        <Button
          onClick={saveToDatabase}
          disabled={isSaving || allData.length === 0}
        >
          {isSaving ? 'Actualizando...' : 'Actualizar Base de Datos'}
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Buscar por nombre..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {daysOrder.map(day => (
                  <TableHead key={day} className="text-center">{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {daysOrder.map(day => (
                  <TableCell key={day} className="align-top">
                    {groupedData[day]?.map((breakItem, index) => (
                      <div key={index} className="mb-2">
                        <strong>{breakItem.employeeName}</strong>: {breakItem.breakTime}
                      </div>
                    )) || 'No hay breaks programados'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreaksDashboard;