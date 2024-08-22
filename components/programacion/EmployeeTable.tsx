'use client';
import React, { useState, useEffect } from 'react';
import { getPersonnel, PersonnelSelect } from '@/utils/database';
import { User, Clock, Briefcase, Search } from 'lucide-react';

type EmployeeCardProps = {
  employee: PersonnelSelect;
};

function EmployeeCard({ employee }: EmployeeCardProps) {
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
      </div>
    </div>
  );
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<PersonnelSelect[]>([]);
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
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
}
