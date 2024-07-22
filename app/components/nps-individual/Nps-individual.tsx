'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { getPersonnel, addPersonnel, updatePersonnel, PersonnelRow } from '@/utils/database';
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Interfaces for props
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

// Custom UI components
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

// FormData interface
interface FormData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  entryTime: string;
  exitTime: string;
  hoursWorked: number;
  xLite: string;
  responses: number;
  nps: number;
  csat: number;
  rd: number;
}

const EmployeeMetricsCRUD: React.FC = () => {
  const [employees, setEmployees] = useState<PersonnelRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<PersonnelRow | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
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
    rd: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getPersonnel();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const showDialog = (employee?: PersonnelRow) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData(employee);
    } else {
      setEditingEmployee(null);
      setFormData({
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
        rd: 0
      });
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['firstName', 'lastName', 'email', 'dni', 'entryTime', 'exitTime', 'xLite'].includes(name) 
        ? value 
        : Number(value) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await updatePersonnel(formData as PersonnelRow);
      } else {
        await addPersonnel(formData as Omit<PersonnelRow, 'id'>);
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

  const EmployeeMetricsChart: React.FC<{ employee: PersonnelRow }> = ({ employee }) => {
    const data = [
      { name: 'NPS', value: employee.nps },
      { name: 'CSAT', value: employee.csat },
      { name: 'RD', value: employee.rd },
    ];

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-64">
        <h3 className="text-lg font-semibold mb-2">{`${employee.firstName} ${employee.lastName}'s Metrics`}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Metrics</h1>
        <Button onClick={() => showDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      {filteredEmployees.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No employees found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="mb-4">
              <EmployeeMetricsChart employee={employee} />
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{`${employee.firstName} ${employee.lastName}`}</h3>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => showDialog(employee)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <h2 className="text-xl font-bold mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nps">NPS</Label>
              <Input
                id="nps"
                name="nps"
                type="number"
                value={formData.nps}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="csat">CSAT</Label>
              <Input
                id="csat"
                name="csat"
                type="number"
                value={formData.csat}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="rd">RD</Label>
              <Input
                id="rd"
                name="rd"
                type="number"
                value={formData.rd}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default EmployeeMetricsCRUD;