'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getPersonnel, updatePersonnel, PersonnelSelect } from '@/utils/database';
import { User, Clock, Briefcase, Search, Edit } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "@/app/components/ui/use-toast";

type EmployeeCardProps = {
  employee: PersonnelSelect;
  onUpdateEmployee: (updatedEmployee: PersonnelSelect) => Promise<void>;
};

function EmployeeCard({ employee, onUpdateEmployee }: EmployeeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdateEmployee(editedEmployee);
      setIsEditing(false);
      toast({
        title: "Employee Updated",
        description: "Employee information has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the employee information.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <User size={24} />
            <span className="font-semibold">{`${editedEmployee.firstName} ${editedEmployee.lastName}`}</span>
          </div>
          <div className="mt-2 text-sm">{editedEmployee.email}</div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleEdit}>
          <Edit size={16} className="mr-2" />
          Edit
        </Button>
      </div>
      <div className="p-4">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <Input
              name="firstName"
              value={editedEmployee.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <Input
              name="lastName"
              value={editedEmployee.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            <Input
              name="email"
              value={editedEmployee.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <Input
              name="dni"
              value={editedEmployee.dni}
              onChange={handleInputChange}
              placeholder="DNI"
            />
            <Input
              name="xLite"
              value={editedEmployee.xLite}
              onChange={handleInputChange}
              placeholder="X-Lite"
            />
            <Input
              name="entryTime"
              value={editedEmployee.entryTime}
              onChange={handleInputChange}
              placeholder="Entry Time"
            />
            <Input
              name="exitTime"
              value={editedEmployee.exitTime}
              onChange={handleInputChange}
              placeholder="Exit Time"
            />
            <Input
              name="hoursWorked"
              value={editedEmployee.hoursWorked.toString()}
              onChange={handleInputChange}
              placeholder="Hours Worked"
              type="number"
            />
            <Button onClick={handleSave} className="col-span-2">Save Changes</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><span className="font-semibold">DNI:</span> {editedEmployee.dni}</div>
            <div><span className="font-semibold">X-Lite:</span> {editedEmployee.xLite}</div>
            <div className="col-span-2 flex items-center space-x-2">
              <Clock size={16} />
              <span><span className="font-semibold">Ingreso:</span> {editedEmployee.entryTime}</span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Clock size={16} />
              <span><span className="font-semibold">Egreso:</span> {editedEmployee.exitTime}</span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Briefcase size={16} />
              <span><span className="font-semibold">Horas de Trabajo:</span> {editedEmployee.hoursWorked}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<PersonnelSelect[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const fetchedEmployees = await getPersonnel();
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchTerm) ||
    employee.lastName.toLowerCase().includes(searchTerm) ||
    employee.email.toLowerCase().includes(searchTerm) ||
    employee.dni.includes(searchTerm)
  );

  const handleUpdateEmployee = async (updatedEmployee: PersonnelSelect) => {
    try {
      await updatePersonnel(updatedEmployee);
      const updatedEmployees = employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading employees...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Lista de Empleados</h2>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-grow w-full md:w-auto md:mr-4">
          <Input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="grid gap-6">
        {filteredEmployees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onUpdateEmployee={handleUpdateEmployee}
          />
        ))}
      </div>
    </div>
  );
}
