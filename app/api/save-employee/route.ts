// File: app/api/save-employee/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addEmployeeMetric } from '@/utils/database';

export async function POST(request: NextRequest) {
  console.log('API route hit: /api/save-employee');
  try {
    const employeesData = await request.json();
    console.log('Received data:', JSON.stringify(employeesData, null, 2));
    
    for (const employeeData of employeesData) {
      console.log('Processing employee:', JSON.stringify(employeeData, null, 2));
      await addEmployeeMetric(employeeData);
    }
    
    console.log('All employee data saved successfully');
    return NextResponse.json({ message: 'All employee data saved successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Detailed error:', errorMessage);
    return NextResponse.json({ error: 'Failed to save employees data', details: errorMessage }, { status: 500 });
  }
}