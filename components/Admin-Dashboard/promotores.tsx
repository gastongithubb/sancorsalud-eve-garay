'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadCloud, Filter, Save, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { insertCustomerExperience, CustomerExperienceInsert, getCustomerExperienceData, CustomerExperienceSelect } from '@/utils/database';
import SancorSaludLoading from '@/components/loading'


interface CSVRow {
  [key: string]: string;
}

interface ProcessedData {
  ExperienciaColaborador: string;
  NpsDescripcionEncuestaWit: string;
  NumeroCasoCRM: string;
  ResolucionDeclaradaEncuestaWit: string;
  SatisfaccionCsatEncuestaWit: string;
  SubtipoCasoCRM: string;
  SubtipoFinalCasoCRM: string;
  TipoCaso: string;
  TipoRegistro: string;
  NpsEncuestaWit: string;
  DiaSinHora: string;
  EsfuerzoCesEncuestaWit: string;
  DescCESAgrupado: string;
  DescSATAgrupado: string;
}

const CSVUploader: React.FC = () => {
  const [csvData, setCSVData] = useState<ProcessedData[]>([]);
  const [dbData, setDbData] = useState<CustomerExperienceSelect[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [filterName, setFilterName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchDataFromDB();
  }, []);

  const fetchDataFromDB = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomerExperienceData();
      setDbData(data);
    } catch (err) {
      console.error('Error fetching data from DB:', err);
      setError('Error al cargar los datos de la base de datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError(null);
      setIsLoading(true);
      
      Papa.parse<CSVRow>(file, {
        complete: async (result) => {
          try {
            const processed = result.data
              .filter((row): row is CSVRow => row && typeof row === 'object')
              .map(processRow)
              .filter((row): row is ProcessedData => row !== null);
            setCSVData(processed);

            // Insertar los datos procesados en la base de datos
            for (const row of processed) {
              await insertCustomerExperience(row as CustomerExperienceInsert);
            }

            console.log('Todos los datos han sido insertados en la base de datos');
            fetchDataFromDB(); // Refrescar los datos después de la inserción
          } catch (err) {
            setError('Error al procesar o insertar el archivo CSV. Por favor, verifica el formato.');
            console.error('Error processing or inserting CSV:', err);
          } finally {
            setIsLoading(false);
          }
        },
        header: true,
        error: (err) => {
          setError(`Error al leer el archivo CSV: ${err.message}`);
          console.error('Papa Parse error:', err);
          setIsLoading(false);
        }
      });
    }
  };

  const processRow = (row: CSVRow): ProcessedData | null => {
    try {
      return {
        ExperienciaColaborador: row['Experiencia Colaborador'] || '',
        NpsDescripcionEncuestaWit: row['Nps Descripcion Encuesta Wit'] || '',
        NumeroCasoCRM: row['Numero Caso CRM'] || '',
        ResolucionDeclaradaEncuestaWit: row['Resolucion Declarada Encuesta Wit'] || '',
        SatisfaccionCsatEncuestaWit: row['Satisfaccion Csat Encuesta Wit'] || '',
        SubtipoCasoCRM: row['Subtipo Caso CRM'] || '',
        SubtipoFinalCasoCRM: row['Subtipo Final Caso CRM'] || '',
        TipoCaso: row['Tipo Caso'] || '',
        TipoRegistro: row['Tipo Registro'] || '',
        NpsEncuestaWit: row['Nps Encuesta Wit'] || '',
        DiaSinHora: row['Dia Sin Hora'] || '',
        EsfuerzoCesEncuestaWit: row['Esfuerzo Ces Encuesta Wit'] || '',
        DescCESAgrupado: row['Desc. CES Agrupado'] || '',
        DescSATAgrupado: row['Desc. SAT Agrupado'] || ''
      };
    } catch (err) {
      console.error('Error processing row:', err, row);
      return null;
    }
  };

  const filteredData = useMemo(() => {
    return dbData.filter(row => 
      row.ExperienciaColaborador.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [dbData, filterName]);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Carga y Visualización de Datos de Experiencia del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="csv-upload" className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer">
              <UploadCloud className="mr-2 h-4 w-4" />
              Cargar CSV
            </Label>
            <Input 
              id="csv-upload"
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
            {fileName && <span className="text-sm text-muted-foreground">Archivo: {fileName}</span>}
            <Button onClick={fetchDataFromDB} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refrescar Datos
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filtrar por Experiencia Colaborador"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
        <SancorSaludLoading />
      ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {dbData[0] && Object.keys(dbData[0]).map((header, index) => (
                      <TableHead key={index} className="whitespace-nowrap">{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <TableCell key={cellIndex} className="whitespace-nowrap">{cell?.toString() || 'N/A'}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;