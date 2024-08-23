import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clearBreaks, insertBreak, getBreaks } from '@/utils/database';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BreakData {
  employeeName: string;
  date: string;
  breakTime: string;
}

const parseCSV = (csv: string): BreakData[] => {
  const lines = csv.split('\n');
  const data: BreakData[] = [];
  let currentDate = '';

  lines.forEach(line => {
    const [first, second] = line.split(',');
    if (first.startsWith('"') && first.endsWith('"')) {
      currentDate = first.replace(/"/g, '').trim();
    } else if (first && second) {
      data.push({
        employeeName: first.trim(),
        date: currentDate,
        breakTime: second.trim()
      });
    }
  });

  return data.filter(item => item.breakTime !== '-');
};

const BreaksDashboard: React.FC = () => {
  const [csvData, setCsvData] = useState<BreakData[]>([]);
  const [dbData, setDbData] = useState<BreakData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDataFromDb();
  }, []);

  const loadDataFromDb = async () => {
    try {
      const breaks = await getBreaks();
      setDbData(breaks);
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
          const parsedData = parseCSV(content);
          setCsvData(parsedData);
        }
      };
      reader.readAsText(file);
    }
  };

  const saveToDatabase = async () => {
    if (csvData.length === 0) return;

    setIsSaving(true);
    try {
      await clearBreaks();
      for (const breakItem of csvData) {
        await insertBreak(breakItem);
      }
      alert('Break data updated successfully!');
      loadDataFromDb();
    } catch (error) {
      console.error('Error updating break data:', error);
      alert('Error updating break data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayData = csvData.length > 0 ? csvData : dbData;

  const filteredData = displayData.filter(item => 
    item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, BreakData[]>);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Grupo Sancor</h1>
      <div className="mb-4 flex items-center gap-4">
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".csv"
          className="flex-grow"
        />
        {csvData.length > 0 && (
          <Button
            onClick={saveToDatabase}
            disabled={isSaving}
          >
            {isSaving ? 'Updating...' : 'Update Database'}
          </Button>
        )}
      </div>
      <Input
        type="text"
        placeholder="Buscar por nombre..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-8">
        {Object.entries(groupedData).map(([date, breaks]) => (
          <Card key={date} className="mb-6">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">{date}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Break</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breaks.map((breakItem, index) => (
                    <TableRow key={index}>
                      <TableCell>{breakItem.employeeName}</TableCell>
                      <TableCell>{breakItem.breakTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BreaksDashboard;