'use client'
import React, { useState } from 'react';
import { getEmployees, getBreakSchedules, updateBreakSchedule } from '@/utils/db';
import { User, Clock, Briefcase, Search, Coffee, Save, RefreshCw } from 'lucide-react';
import Image from 'next/image';

// Definiciones de tipos
type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  entryTime: string;
  exitTime: string;
  hoursWorked: number;
  xLite: string;
  photo?: string;
};

type Break = {
  id: number;
  employeeId: number;
  day: string;
  startTime: string;
  endTime: string;
  week: number;
  month: number;
  year: number;
};

type EmployeeCardProps = {
  employee: Employee;
  onUpdateBreak: (employeeId: number, breakData: Omit<Break, 'id'>) => Promise<void>;
};

// Client component para la interactividad
function EmployeeCard({ employee, onUpdateBreak }: EmployeeCardProps) {
  const [showBreaks, setShowBreaks] = useState(false);
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [isLoadingBreaks, setIsLoadingBreaks] = useState(false);
  const [newBreak, setNewBreak] = useState<Omit<Break, 'id' | 'employeeId' | 'week' | 'month' | 'year'>>({ 
    day: '', 
    startTime: '', 
    endTime: '' 
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
    const breakData = {
      ...newBreak,
      employeeId: employee.id,
      week: 1, // Asume semana 1, ajusta según sea necesario
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    };
    
    await onUpdateBreak(employee.id, breakData);
    
    // Refetch breaks to get the updated list
    fetchBreaks();
    setNewBreak({ day: '', startTime: '', endTime: '' });
  };

  const orderDays = (breaks: Break[]) => {
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
        {employee.photo && (
          <Image src={employee.photo} alt={`${employee.firstName} ${employee.lastName}`} width={50} height={50} className="rounded-full" />
        )}
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
                  <span>{`${breakItem.day}: ${breakItem.startTime} - ${breakItem.endTime}`}</span>
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
              <input
                type="time"
                value={newBreak.endTime}
                onChange={(e) => setNewBreak({...newBreak, endTime: e.target.value})}
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

// Server Component
export default async function EmployeeTable() {
  const employees = await getEmployees();

  // Client Component para manejar la búsqueda y actualización de breaks
  function EmployeeTableClient({ initialEmployees }: { initialEmployees: Employee[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredEmployees = initialEmployees.filter(employee => 
      employee.firstName.toLowerCase().includes(searchTerm) ||
      employee.lastName.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm) ||
      employee.dni.includes(searchTerm)
    );

    const handleUpdateBreak = async (employeeId: number, breakData: Omit<Break, 'id'>) => {
      await updateBreakSchedule(breakData);
    };

    return (
      <>
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
      </>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Lista de Empleados</h2>
      <EmployeeTableClient initialEmployees={employees} />
    </div>
  );
}