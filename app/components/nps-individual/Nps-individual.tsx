'use client';
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

// Updated interfaces for employee data
interface MonthlyMetrics {
  month: string;
  nps: number;
  surveys: number;
  csat: number;
  rd: number;
  dni: string;
  entryTime: string;
  exitTime: string;
  hoursWorked: number;
  xLite: string;
  responses: number;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  monthlyMetrics: MonthlyMetrics[];
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

const EmployeeMetricsCRUD: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [formData, setFormData] = useState<MonthlyMetrics & { firstName: string; lastName: string; email: string }>({
    firstName: '',
    lastName: '',
    email: '',
    month: selectedMonth,
    nps: 0,
    surveys: 0,
    csat: 0,
    rd: 0,
    dni: '',
    entryTime: '',
    exitTime: '',
    hoursWorked: 0,
    xLite: '',
    responses: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getPersonnel();
      setEmployees(data.map((item: any) => ({
        ...item,
        monthlyMetrics: item.monthlyMetrics || []
      })));
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const showDialog = (employee?: Employee) => {
    if (employee) {
      const currentMonthMetrics = employee.monthlyMetrics.find(m => m.month === selectedMonth) || {
        month: selectedMonth,
        nps: 0,
        surveys: 0,
        csat: 0,
        rd: 0,
        dni: '',
        entryTime: '',
        exitTime: '',
        hoursWorked: 0,
        xLite: '',
        responses: 0
      };
      setEditingEmployee(employee);
      setFormData({ ...employee, ...currentMonthMetrics });
    } else {
      setEditingEmployee(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        month: selectedMonth,
        nps: 0,
        surveys: 0,
        csat: 0,
        rd: 0,
        dni: '',
        entryTime: '',
        exitTime: '',
        hoursWorked: 0,
        xLite: '',
        responses: 0
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
      if (editingEmployee) {
        const updatedEmployee: Employee = {
          ...editingEmployee,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          monthlyMetrics: editingEmployee.monthlyMetrics.map(m => 
            m.month === selectedMonth ? { ...formData, month: selectedMonth } : m
          )
        };
        if (!updatedEmployee.monthlyMetrics.some(m => m.month === selectedMonth)) {
          updatedEmployee.monthlyMetrics.push({
            month: selectedMonth,
            nps: formData.nps,
            surveys: formData.surveys,
            csat: formData.csat,
            rd: formData.rd,
            dni: formData.dni,
            entryTime: formData.entryTime,
            exitTime: formData.exitTime,
            hoursWorked: formData.hoursWorked,
            xLite: formData.xLite,
            responses: formData.responses
          });
        }
        await updatePersonnel(updatedEmployee);
      } else {
        const newEmployee: Employee = {
          id: Date.now(), // temporary ID, should be replaced by database
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          monthlyMetrics: [{
            month: selectedMonth,
            nps: formData.nps,
            surveys: formData.surveys,
            csat: formData.csat,
            rd: formData.rd,
            dni: formData.dni,
            entryTime: formData.entryTime,
            exitTime: formData.exitTime,
            hoursWorked: formData.hoursWorked,
            xLite: formData.xLite,
            responses: formData.responses
          }]
        };
        await addPersonnel(newEmployee);
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

  const EmployeeMetricsChart: React.FC<{ employee: Employee }> = ({ employee }) => {
    const currentMonthMetrics = employee.monthlyMetrics.find(m => m.month === selectedMonth) || {
      month: selectedMonth,
      nps: 0,
      surveys: 0,
      csat: 0,
      rd: 0
    };

    const data = [
      { name: 'NPS', value: currentMonthMetrics.nps },
      { name: 'Surveys', value: currentMonthMetrics.surveys },
      { name: 'CSAT', value: currentMonthMetrics.csat },
      { name: 'RD', value: currentMonthMetrics.rd }
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const filteredEmployees = useMemo(
    () => employees.filter(employee =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [employees, searchTerm]
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Employee Metrics CRUD</h1>
      <div className="mb-4 flex justify-between">
        <Button onClick={() => showDialog()}>Add Employee</Button>
        <input
          type="text"
          placeholder="Search..."
          className="border px-2 py-1 rounded"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border-b">{employee.firstName}</td>
                <td className="py-2 px-4 border-b">{employee.lastName}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">
                  <Button onClick={() => showDialog(employee)} variant="outline" size="icon">
                    <Pencil />
                  </Button>
                  <Button onClick={() => handleDelete(employee.id)} variant="outline" size="icon">
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
          <div className="mb-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="month">Month</Label>
            <Input id="month" name="month" value={formData.month} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="nps">NPS</Label>
            <Input id="nps" name="nps" value={formData.nps} onChange={handleInputChange} type="number" required />
          </div>
          <div className="mb-4">
            <Label htmlFor="surveys">Surveys</Label>
            <Input id="surveys" name="surveys" value={formData.surveys} onChange={handleInputChange} type="number" required />
          </div>
          <div className="mb-4">
            <Label htmlFor="csat">CSAT</Label>
            <Input id="csat" name="csat" value={formData.csat} onChange={handleInputChange} type="number" required />
          </div>
          <div className="mb-4">
            <Label htmlFor="rd">RD</Label>
            <Input id="rd" name="rd" value={formData.rd} onChange={handleInputChange} type="number" required />
          </div>
          <div className="mb-4">
            <Label htmlFor="dni">DNI</Label>
            <Input id="dni" name="dni" value={formData.dni} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="entryTime">Entry Time</Label>
            <Input id="entryTime" name="entryTime" value={formData.entryTime} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="exitTime">Exit Time</Label>
            <Input id="exitTime" name="exitTime" value={formData.exitTime} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="hoursWorked">Hours Worked</Label>
            <Input id="hoursWorked" name="hoursWorked" value={formData.hoursWorked} onChange={handleInputChange} type="number" required />
          </div>
          <div className="mb-4">
            <Label htmlFor="xLite">X Lite</Label>
            <Input id="xLite" name="xLite" value={formData.xLite} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="responses">Responses</Label>
            <Input id="responses" name="responses" value={formData.responses} onChange={handleInputChange} type="number" required />
          </div>
          <div className="flex justify-end">
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
