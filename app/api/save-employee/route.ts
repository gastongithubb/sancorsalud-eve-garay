// File: app/api/save-employee/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addEmployeeMetric } from '@/utils/database';

export async function POST(request: NextRequest) {
  try {
    const employeesData = await request.json();
    
    // Asumiendo que employeesData es un array de métricas de empleados
    for (const employeeData of employeesData) {
      await addEmployeeMetric(employeeData);
    }
    
    return NextResponse.json({ message: 'All employee data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving employees data:', error);
    return NextResponse.json({ error: 'Failed to save employees data' }, { status: 500 });
  }
}