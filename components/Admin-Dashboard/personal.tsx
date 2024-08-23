'use client';

import React, { useState, useEffect } from 'react';
import { getPersonnel, addPersonnel, updatePersonnel, PersonnelSelect, PersonnelInsert } from '@/utils/database';
import { User, Clock, Briefcase, Search, Edit, Coffee, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Loading Animation Component
const LoadingAnimation = () => (
  <div className="flex justify-center items-center h-64">
    <div className="relative">
      <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
      <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
    </div>
  </div>
);

type EmployeeCardProps = {
  employee: PersonnelSelect;
  onUpdateEmployee: (updatedEmployee: PersonnelSelect) => Promise<void>;
};

function EmployeeCard({ employee, onUpdateEmployee }: EmployeeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const router = useRouter();

  const handleEdit = () => setIsEditing(true);

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
    setEditedEmployee(prev => ({ 
      ...prev, 
      [name]: name === 'hoursWorked' || name === 'responses' || name === 'nps' || name === 'csat' || name === 'rd'
        ? parseInt(value, 10)
        : value 
    }));
  };

  const handleBreaksRedirect = () => {
    router.push(`/breaksDiarios`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <User size={20} />
          <span className="font-semibold">{`${editedEmployee.firstName} ${editedEmployee.lastName}`}</span>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={handleEdit} className="mr-2">
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleBreaksRedirect}>
            <Coffee size={14} className="mr-1" />
            Breaks
          </Button>
        </div>
      </div>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <Input name="firstName" value={editedEmployee.firstName} onChange={handleInputChange} placeholder="First Name" />
          <Input name="lastName" value={editedEmployee.lastName} onChange={handleInputChange} placeholder="Last Name" />
          <Input name="email" value={editedEmployee.email} onChange={handleInputChange} placeholder="Email" />
          <Input name="dni" value={editedEmployee.dni} onChange={handleInputChange} placeholder="DNI" />
          <Input name="xLite" value={editedEmployee.xLite} onChange={handleInputChange} placeholder="X-Lite" />
          <Input name="entryTime" value={editedEmployee.entryTime} onChange={handleInputChange} placeholder="Entry Time" />
          <Input name="exitTime" value={editedEmployee.exitTime} onChange={handleInputChange} placeholder="Exit Time" />
          <Input name="hoursWorked" value={editedEmployee.hoursWorked.toString()} onChange={handleInputChange} placeholder="Hours Worked" type="number" />
          <Button onClick={handleSave} className="col-span-2">Save Changes</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">DNI:</span> {editedEmployee.dni}</div>
          <div><span className="font-semibold">X-Lite:</span> {editedEmployee.xLite}</div>
          <div><Clock size={14} className="inline mr-1" /> <span className="font-semibold">In:</span> {editedEmployee.entryTime}</div>
          <div><Clock size={14} className="inline mr-1" /> <span className="font-semibold">Out:</span> {editedEmployee.exitTime}</div>
          <div className="col-span-2"><Briefcase size={14} className="inline mr-1" /> <span className="font-semibold">Hours:</span> {editedEmployee.hoursWorked}</div>
        </div>
      )}
    </div>
  );
}

function AddEmployeeModal({ onAddEmployee }: { onAddEmployee: (newEmployee: PersonnelInsert) => Promise<void> }) {
  const [newEmployee, setNewEmployee] = useState<PersonnelInsert>({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    xLite: '',
    entryTime: '',
    exitTime: '',
    hoursWorked: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ 
      ...prev, 
      [name]: name === 'hoursWorked' || name === 'responses' || name === 'nps' || name === 'csat' || name === 'rd' 
        ? parseInt(value, 10) 
        : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddEmployee(newEmployee);
      setIsOpen(false);
      setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        dni: '',
        xLite: '',
        entryTime: '',
        exitTime: '',
        hoursWorked: 0,
      });
      toast({
        title: "Employee Added",
        description: "New employee has been successfully added.",
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Add Failed",
        description: "There was an error adding the new employee.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="firstName" value={newEmployee.firstName} onChange={handleInputChange} placeholder="First Name" required />
          <Input name="lastName" value={newEmployee.lastName} onChange={handleInputChange} placeholder="Last Name" required />
          <Input name="email" value={newEmployee.email} onChange={handleInputChange} placeholder="Email" required type="email" />
          <Input name="dni" value={newEmployee.dni} onChange={handleInputChange} placeholder="DNI" required />
          <Input name="xLite" value={newEmployee.xLite} onChange={handleInputChange} placeholder="X-Lite" required />
          <Input name="entryTime" value={newEmployee.entryTime} onChange={handleInputChange} placeholder="Entry Time" required type="time" />
          <Input name="exitTime" value={newEmployee.exitTime} onChange={handleInputChange} placeholder="Exit Time" required type="time" />
          <Input name="hoursWorked" value={newEmployee.hoursWorked.toString()} onChange={handleInputChange} placeholder="Hours Worked" required type="number" />
          <Button type="submit">Add Employee</Button>
        </form>
      </DialogContent>
    </Dialog>
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

  const handleAddEmployee = async (newEmployee: PersonnelInsert) => {
    try {
      await addPersonnel(newEmployee);
      await fetchEmployees(); // Refresh the employee list
      toast({
        title: "Employee Added",
        description: "New employee has been successfully added to the database.",
      });
    } catch (error) {
      console.error('Error adding new employee:', error);
      toast({
        title: "Add Failed",
        description: "There was an error adding the new employee to the database.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de Empleados</h2>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex-grow mr-4">
          <Input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <AddEmployeeModal onAddEmployee={handleAddEmployee} />
      </div>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onUpdateEmployee={handleUpdateEmployee}
            />
          ))}
        </div>
      )}
    </div>
  );
}