'use client'
import React, { useState, useEffect } from 'react';
import { getPersonnel, addPersonnel, updatePersonnel, PersonnelRow } from '@/utils/database';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

// Componentes de UI personalizados
const Table = ({ children }) => <table className="w-full text-left">{children}</table>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableCaption = ({ children }) => <caption className="text-lg mb-4">{children}</caption>;
const TableCell = ({ children }) => <td className="border px-4 py-2">{children}</td>;
const TableHead = ({ children }) => <th className="border px-4 py-2 bg-gray-100">{children}</th>;
const TableHeader = ({ children }) => <thead>{children}</thead>;
const TableRow = ({ children }) => <tr>{children}</tr>;

const Button = ({ children, onClick, variant = 'primary', size = 'md' }) => {
  const baseStyle = 'px-4 py-2 rounded';
  const styles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'bg-transparent text-blue-500 hover:bg-blue-50',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50'
  };
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${styles[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
};

const Input = ({ id, name, value, onChange, type = 'text', required }) => (
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

const Dialog = ({ open, onOpenChange, children }) => (
  open ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-4">{children}</div>
  </div> : null
);

const DialogContent = ({ children }) => <div>{children}</div>;
const DialogHeader = ({ children }) => <div className="border-b pb-2 mb-4">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;
const DialogTrigger = ({ children, onClick }) => (
  <div onClick={onClick}>
    {children}
  </div>
);

const Label = ({ htmlFor, children }) => <label htmlFor={htmlFor} className="block mb-1">{children}</label>;

const EmployeeMetricsCRUD = () => {
  const [employees, setEmployees] = useState<PersonnelRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<PersonnelRow | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

  const showDialog = (employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData(employee);
    } else {
      setEditingEmployee(null);
      setFormData({ firstName: '', lastName: '', nps: 0, csat: 0, rd: 0 });
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'firstName' || name === 'lastName' ? value : Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await updatePersonnel({ ...formData, id: editingEmployee.id });
      } else {
        await addPersonnel(formData);
      }
      setIsDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleDelete = async (id) => {
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Metrics</h1>
        <Button onClick={() => showDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>
      
      <Table>
        <TableCaption>A list of your employees and their metrics.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>NPS</TableHead>
            <TableHead>CSAT</TableHead>
            <TableHead>RD</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map(employee => (
            <TableRow key={employee.id}>
              <TableCell>{employee.firstName}</TableCell>
              <TableCell>{employee.lastName}</TableCell>
              <TableCell>{employee.nps}</TableCell>
              <TableCell>{employee.csat}</TableCell>
              <TableCell>{employee.rd}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => showDialog(employee)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
              <div className="space-y-2">
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeMetricsCRUD
