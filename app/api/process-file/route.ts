// app/api/process-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { getDB } from '@/utils/database';
import { uploadedFiles } from '@/utils/database';
import pdfParse from 'pdf-parse';

interface EmployeeData {
  name: string;
  atendidas: number;
  tiempoAtencion: number;
  promTAtencion: number;
  promTRinging: number;
  qDeEncuestas: number;
  nps: number;
  sat: number;
  rd: number;
  diasLogueado: number;
  promLogueo: string;
  porcentajeReady: number;
  porcentajeACD: number;
  porcentajeNoDispTotal: number;
  porcentajeNoDispProductivo: number;
}

async function processPDFContent(buffer: Buffer): Promise<EmployeeData[]> {
  const data = await pdfParse(buffer);
  const lines = data.text.split('\n').filter(line => line.trim() !== '');
  const employeeData: EmployeeData[] = [];

  // Asumimos que la primera línea es el encabezado y la ignoramos
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/\s+/);
    if (values.length >= 15) {
      employeeData.push({
        name: values.slice(0, 3).join(' '), // Asumiendo que el nombre puede tener hasta 3 palabras
        atendidas: parseInt(values[3]),
        tiempoAtencion: parseInt(values[4]),
        promTAtencion: parseFloat(values[5]),
        promTRinging: parseFloat(values[6]),
        qDeEncuestas: parseInt(values[7]),
        nps: parseInt(values[8]),
        sat: parseInt(values[9]),
        rd: parseInt(values[10]),
        diasLogueado: parseInt(values[11]),
        promLogueo: values[12],
        porcentajeReady: parseInt(values[13]),
        porcentajeACD: parseInt(values[14]),
        porcentajeNoDispTotal: parseInt(values[15]),
        porcentajeNoDispProductivo: parseInt(values[16]),
      });
    }
  }

  return employeeData;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = join(process.cwd(), 'tmp');
    const filePath = join(tempDir, file.name);
    await writeFile(filePath, buffer);

    const employeeData = await processPDFContent(buffer);

    const db = getDB();
    const insertPromises = employeeData.map(employee => 
      db.insert(uploadedFiles).values({
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        filePath: filePath,
        uploadDate: new Date().toISOString(),
        processedData: JSON.stringify(employee),
      }).run()
    );

    await Promise.all(insertPromises);

    // Limpieza: eliminar el archivo temporal
    await unlink(filePath);

    return NextResponse.json({ message: 'File processed and data saved successfully', data: employeeData });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 });
  }
}