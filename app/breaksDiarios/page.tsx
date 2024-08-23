'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBreaks } from '@/utils/database';
import { Input } from "@/components/ui/input"

interface BreakData {
  employeeName: string;
  date: string;
  breakTime: string;
}

const AllBreaksViewer: React.FC = () => {
  const [breaks, setBreaks] = useState<BreakData[]>([]);
  const [filteredBreaks, setFilteredBreaks] = useState<BreakData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadAllBreaks = useCallback(async () => {
    try {
      const allBreaks = await getBreaks();
      console.log('All breaks loaded:', allBreaks);
      setBreaks(allBreaks);
      setFilteredBreaks(allBreaks);
    } catch (error) {
      console.error('Error loading breaks:', error);
    }
  }, []);

  const filterBreaks = useCallback(() => {
    const filtered = breaks.filter(breakItem =>
      breakItem.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered breaks:', filtered);
    setFilteredBreaks(filtered);
  }, [breaks, searchTerm]);

  useEffect(() => {
    loadAllBreaks();
  }, [loadAllBreaks]);

  useEffect(() => {
    filterBreaks();
  }, [filterBreaks]);

  const groupedBreaks = filteredBreaks.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, BreakData[]>);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Breaks</h1>
      <Input
        type="text"
        placeholder="Buscar por nombre de empleado..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-8">
        {Object.entries(groupedBreaks).map(([date, dateBreaks]) => (
          <Card key={date} className="mb-6">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">{date}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Break</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dateBreaks.map((breakItem, index) => (
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

export default AllBreaksViewer;