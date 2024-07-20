'use client'
import React, { useState, useEffect } from 'react';
import { getPersonnel, getBreakSchedules, updateBreakSchedule, PersonnelRow, BreakScheduleRow } from '@/utils/database';
import { User, Clock, Briefcase, Search, Coffee, Save, RefreshCw } from 'lucide-react';
import Image from 'next/image';

type EmployeeCardProps = {
  employee: PersonnelRow;
  onUpdateBreak: (breakData: Omit<BreakScheduleRow, 'id'>) => Promise<void>;
};

function EmployeeCard({ employee, onUpdateBreak }: EmployeeCardProps) {
  const [showBreaks, setShowBreaks] = useState(false);
  const [breaks, setBreaks] = useState<BreakScheduleRow[]>([]);
  const [isLoadingBreaks, setIsLoadingBreaks] = useState(false);
  const [newBreak, setNewBreak] = useState<Omit<BreakScheduleRow, 'id'>>({
    personnelId: employee.id,
    day: '',
    startTime: '',
    endTime: '',
    week: 1,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const fetchBreaks = async () => {
    setIsLoadingBreaks(true);
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const fetchedBreaks = await getBreakSchedules(employee.id, currentMonth, currentYear);
      setBreaks(fetchedBreaks);
    } catch (error) {
      console.error('Error fetching breaks:', error);
    } finally {
      setIsLoadingBreaks(false);
    }
  };

  const handleShowBreaks = () => {
    if (!showBreaks) {
      fetchBreaks();
    }
    setShowBreaks(!showBreaks);
  };

  const handleAddBreak = async () => {
    await onUpdateBreak(newBreak);
    fetchBreaks();
    setNewBreak({
      ...newBreak,
      day: '',
      startTime: '',
    });
  };

  const orderDays = (breaks: BreakScheduleRow[]) => {
    const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    return breaks.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <User size={24} />
            <span className="font-semibold">{`${employee.firstName} ${employee.lastName}`}</span>
          </div>
          <div className="mt-2 text-sm">{employee.email}</div>
        </div>
        {/* Note: Photo is not included in the provided database schema */}
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div><span className="font-semibold">DNI:</span> {employee.dni}</div>
          <div><span className="font-semibold">X-Lite:</span> {employee.xLite}</div>
          <div className="col-span-2 flex items-center space-x-2">
            <Clock size={16} />
            <span><span className="font-semibold">Ingreso:</span> {employee.entryTime}</span>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Clock size={16} />
            <span><span className="font-semibold">Egreso:</span> {employee.exitTime}</span>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Briefcase size={16} />
            <span><span className="font-semibold">Horas de Trabajo:</span> {employee.hoursWorked}</span>
          </div>
        </div>
        <button
          onClick={handleShowBreaks}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          {showBreaks ? 'Ocultar Breaks' : 'Mostrar Breaks'}
        </button>
        {showBreaks && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Breaks:</h4>
              <button
                onClick={fetchBreaks}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                disabled={isLoadingBreaks}
              >
                <RefreshCw size={16} className={isLoadingBreaks ? 'animate-spin' : ''} />
              </button>
            </div>
            {isLoadingBreaks ? (
              <p>Cargando breaks...</p>
            ) : (
              orderDays(breaks).map((breakItem) => (
                <div key={breakItem.id} className="mb-2 flex items-center space-x-2">
                  <Coffee size={16} />
                  <span>{`${breakItem.day}: ${breakItem.startTime}`}</span>
                </div>
              ))
            )}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <select
                value={newBreak.day}
                onChange={(e) => setNewBreak({...newBreak, day: e.target.value})}
                className="border p-2 rounded"
              >
                <option value="">Seleccione día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
              </select>
              <input
                type="time"
                value={newBreak.startTime}
                onChange={(e) => setNewBreak({...newBreak, startTime: e.target.value})}
                className="border p-2 rounded"
              />
            </div>
            <button
              onClick={handleAddBreak}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Guardar Break</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<PersonnelRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getPersonnel();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchTerm) ||
    employee.lastName.toLowerCase().includes(searchTerm) ||
    employee.email.toLowerCase().includes(searchTerm) ||
    employee.dni.includes(searchTerm)
  );

  const handleUpdateBreak = async (breakData: Omit<BreakScheduleRow, 'id'>) => {
    try {
      await updateBreakSchedule(breakData);
    } catch (error) {
      console.error('Error updating break schedule:', error);
    }
  };

  if (isLoading) {
    return <div>Loading employees...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Lista de Empleados</h2>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onUpdateBreak={handleUpdateBreak}
          />
        ))}
      </div>
    </div>
  );
}