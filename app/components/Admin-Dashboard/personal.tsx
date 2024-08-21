'use client'

import React, { useState, useEffect, useRef } from 'react';
import { getPersonnel, updatePersonnel, getBreakSchedules, updateBreakSchedule, PersonnelSelect, BreakScheduleSelect } from '@/utils/database';
import { User, Clock, Briefcase, Search, Coffee, Save, RefreshCw, Upload, Edit, AlertCircle } from 'lucide-react';
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { toast } from "@/app/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"

type EmployeeCardProps = {
  employee: PersonnelSelect;
  onUpdateEmployee: (updatedEmployee: PersonnelSelect) => Promise<void>;
  onUpdateBreak: (breakData: Omit<BreakScheduleSelect, 'id'>) => Promise<void>;
};

function EmployeeCard({ employee, onUpdateEmployee, onUpdateBreak }: EmployeeCardProps) {
  const [showBreaks, setShowBreaks] = useState(false);
  const [breaks, setBreaks] = useState<BreakScheduleSelect[]>([]);
  const [isLoadingBreaks, setIsLoadingBreaks] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const [newBreak, setNewBreak] = useState<Omit<BreakScheduleSelect, 'id'>>({
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
      toast({
        title: "Error",
        description: "Failed to fetch break schedules. Please try again.",
        variant: "destructive",
      });
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
    if (!newBreak.day || !newBreak.startTime) {
      toast({
        title: "Invalid Input",
        description: "Please select both day and start time for the break.",
        variant: "destructive",
      });
      return;
    }
    try {
      await onUpdateBreak(newBreak);
      fetchBreaks();
      setNewBreak({
        ...newBreak,
        day: '',
        startTime: '',
      });
      toast({
        title: "Break Added",
        description: "The break has been successfully added.",
      });
    } catch (error) {
      console.error('Error adding break:', error);
      toast({
        title: "Error",
        description: "Failed to add break. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      })
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the employee information.",
        variant: "destructive",
      })
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({ ...prev, [name]: value }));
  };

  const orderDays = (breaks: BreakScheduleSelect[]) => {
    const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    return breaks.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
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
        <Button
          onClick={handleShowBreaks}
          variant="outline"
          className="w-full"
        >
          {showBreaks ? 'Ocultar Breaks' : 'Mostrar Breaks'}
        </Button>
        {showBreaks && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Breaks:</h4>
              <Button
                onClick={fetchBreaks}
                variant="ghost"
                size="sm"
                disabled={isLoadingBreaks}
              >
                <RefreshCw size={16} className={isLoadingBreaks ? 'animate-spin' : ''} />
              </Button>
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
              <Input
                type="time"
                value={newBreak.startTime}
                onChange={(e) => setNewBreak({...newBreak, startTime: e.target.value})}
              />
              <Button onClick={handleAddBreak} className="flex items-center justify-center">
                <Save size={16} className="mr-2" />
                <span>Guardar Break</span>
              </Button>
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      })
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

  const handleUpdateBreak = async (breakData: Omit<BreakScheduleSelect, 'id'>) => {
    try {
      await updateBreakSchedule(breakData);
    } catch (error) {
      console.error('Error updating break schedule:', error);
      toast({
        title: "Error",
        description: "Failed to update break schedule. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const rows = text.split('\n');
          let updatedCount = 0;
          let errorCount = 0;
          
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i].trim();
            if (row && !row.startsWith('"') && !row.startsWith('Equipo')) {
              const columns = row.split(/\s+/);
              if (columns.length >= 9) {
                const fullName = columns.slice(1, -8).join(' ').trim();
                const breakTime = columns[columns.length - 4];
                
                const employee = employees.find(emp => `${emp.firstName} ${emp.lastName}`.trim() === fullName);
                if (employee) {
                  try {
                    const currentDate = new Date();
                    const breakData: Omit<BreakScheduleSelect, 'id'> = {
                      personnelId: employee.id,
                      day: currentDate.toLocaleDateString('es-ES', { weekday: 'long' }),
                      startTime: breakTime,
                      endTime: '', // Puedes calcular esto basado en tu lógica de negocio
                      week: Math.ceil(currentDate.getDate() / 7),
                      month: currentDate.getMonth() + 1,
                      year: currentDate.getFullYear()
                    };
                    await handleUpdateBreak(breakData);
                    updatedCount++;
                  } catch (error) {
                    console.error(`Error updating break for employee ${fullName}:`, error);
                    errorCount++;
                  }
                } else {
                  console.warn(`Employee ${fullName} not found`);
                  errorCount++;
                }
              }
            }
            setUploadProgress(Math.round(((i + 1) / rows.length) * 100));
          }
          toast({
            title: "CSV Upload Complete",
            description: `Updated ${updatedCount} break schedules. ${errorCount} errors occurred.`,
            variant: errorCount > 0 ? "destructive" : "default",
          });
        }
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Upload size={16} className="mr-2" />
              Cargar CSV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cargar archivo CSV de breaks</DialogTitle>
              <DialogDescription>
                Selecciona un archivo CSV con el formato: Nombre, Día, Break
              </DialogDescription>
            </DialogHeader>
            <Input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {isUploading && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Uploading</AlertTitle>
                <AlertDescription>
                  Please wait while we process the CSV file. Progress: {uploadProgress}%
                </AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {filteredEmployees.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No se encontraron empleados</AlertTitle>
          <AlertDescription>
            No hay empleados que coincidan con tu búsqueda. Intenta con otros términos.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onUpdateEmployee={handleUpdateEmployee}
              onUpdateBreak={handleUpdateBreak}
            />
          ))}
        </div>
      )}
    </div>
  );
}