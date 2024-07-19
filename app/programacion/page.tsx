import EmployeeTable from '../components/programacion/EmployeeTable';

export default function EmployeesPage() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Directorio de Empleados</h1>
        <EmployeeTable />
      </div>
    </main>
  );
}