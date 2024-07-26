'use client'

import React, { useState, useEffect } from 'react';
import { getPersonnel, addPersonnel, updatePersonnel, PersonnelSelect } from '@/utils/database';
import { ChevronLeft, ChevronRight, Edit, Trash2, PlusCircle } from 'lucide-react';

// Interfaces
interface MonthlyMetrics {
  month: string;
  nps: number;
  surveys: number;
  csat: number;
  rd: number;
}


interface Employee extends PersonnelSelect {
  monthlyMetrics: MonthlyMetrics[];
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  type?: 'button' | 'submit' | 'reset';
}

interface InputProps {
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

// UI Components
const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', size = 'md', type = 'button' }) => {
  const baseStyle = 'px-4 py-2 rounded';
  const styles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'bg-transparent text-blue-500 hover:bg-blue-50',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50'
  };
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    icon: 'p-2'
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${styles[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
};

const Input: React.FC<InputProps> = ({ id, name, value, onChange, type = 'text', required }) => (
  <input
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    required={required}
    className="border rounded px-2 py-1 w-full"
  />
);

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => (
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  ) : null
);

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block mb-1 font-medium">
    {children}
  </label>
);

const MetricBar: React.FC<{ value: number; maxValue: number; color: string }> = ({ value, maxValue, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="h-2.5 rounded-full"
      style={{
        width: `${(value / maxValue) * 100}%`,
        backgroundColor: color,
      }}
    ></div>
  </div>
);

const EmployeeCard: React.FC<{ employee: Employee; onEdit: () => void; onDelete: () => void }> = ({ employee, onEdit, onDelete }) => {
  const latestMetrics = employee.monthlyMetrics[employee.monthlyMetrics.length - 1];

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">{`${employee.firstName} ${employee.lastName}`}</h3>
      <p className="text-sm text-gray-600 mb-2">{employee.email}</p>
      <div className="space-y-2">
        <div>
          <Label htmlFor={`nps-${employee.id}`}>NPS</Label>
          <div className="flex items-center">
            <span className="mr-2">{latestMetrics.nps}</span>
            <MetricBar value={latestMetrics.nps} maxValue={100} color="#4CAF50" />
          </div>
        </div>
        <div>
          <Label htmlFor={`csat-${employee.id}`}>CSAT</Label>
          <div className="flex items-center">
            <span className="mr-2">{latestMetrics.csat}</span>
            <MetricBar value={latestMetrics.csat} maxValue={100} color="#2196F3" />
          </div>
        </div>
        <div>
          <Label htmlFor={`rd-${employee.id}`}>RD</Label>
          <div className="flex items-center">
            <span className="mr-2">{latestMetrics.rd}</span>
            <MetricBar value={latestMetrics.rd} maxValue={100} color="#FFC107" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="mr-1" size={16} /> Edit
        </Button>
        <Button onClick={onDelete} variant="outline" size="sm">
          <Trash2 className="mr-1" size={16} /> Delete
        </Button>
      </div>
    </div>
  );
};

const EmployeeMetricsCRUD: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Employee>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    entryTime: '',
    exitTime: '',
    hoursWorked: 0,
    xLite: '',
    responses: 0,
    nps: 0,
    csat: 0,
    rd: 0,
    month: new Date().toLocaleString('default', { month: 'long' }),
    monthlyMetrics: []
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getPersonnel();
      const employeesWithMetrics: Employee[] = data.map(item => ({
        ...item,
        monthlyMetrics: [{
          month: item.month,
          nps: item.nps,
          surveys: item.responses,
          csat: item.csat,
          rd: item.rd
        }]
      }));
      setEmployees(employeesWithMetrics);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const showDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData(employee);
    } else {
      setEditingEmployee(null);
      setFormData({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        dni: '',
        entryTime: '',
        exitTime: '',
        hoursWorked: 0,
        xLite: '',
        responses: 0,
        nps: 0,
        csat: 0,
        rd: 0,
        month: new Date().toLocaleString('default', { month: 'long' }),
        monthlyMetrics: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['firstName', 'lastName', 'email', 'month', 'dni', 'entryTime', 'exitTime', 'xLite'].includes(name) 
        ? value 
        : Number(value) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const updatedFormData = {
        ...formData,
        monthlyMetrics: [
          ...formData.monthlyMetrics,
          {
            month: currentMonth,
            nps: formData.nps,
            surveys: formData.responses,
            csat: formData.csat,
            rd: formData.rd
          }
        ]
      };

      if (editingEmployee) {
        await updatePersonnel(updatedFormData);
      } else {
        await addPersonnel(updatedFormData);
      }
      setIsDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        // Implement delete functionality here
        // For now, we'll just remove it from the local state
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Metrics Dashboard</h1>
        <Button onClick={() => showDialog()}>
          <PlusCircle className="mr-2" /> Add Employee
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={() => showDialog(employee)}
            onDelete={() => handleDelete(employee.id)}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" name="dni" value={formData.dni} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="entryTime">Entry Time</Label>
              <Input id="entryTime" name="entryTime" value={formData.entryTime} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="exitTime">Exit Time</Label>
              <Input id="exitTime" name="exitTime" value={formData.exitTime} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input id="hoursWorked" name="hoursWorked" value={formData.hoursWorked} onChange={handleInputChange} type="number" required />
            </div>
            <div>
              <Label htmlFor="xLite">X Lite</Label>
              <Input id="xLite" name="xLite" value={formData.xLite} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="responses">Responses</Label>
              <Input id="responses" name="responses" value={formData.responses} onChange={handleInputChange} type="number" required />
            </div>
            <div>
              <Label htmlFor="nps">NPS</Label>
              <Input id="nps" name="nps" value={formData.nps} onChange={handleInputChange} type="number" required />
            </div>
            <div>
              <Label htmlFor="csat">CSAT</Label>
              <Input id="csat" name="csat" value={formData.csat} onChange={handleInputChange} type="number" required />
            </div>
            <div>
              <Label htmlFor="rd">RD</Label>
              <Input id="rd" name="rd" value={formData.rd} onChange={handleInputChange} type="number" required />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingEmployee ? 'Update' : 'Add'} Employee
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default EmployeeMetricsCRUD;