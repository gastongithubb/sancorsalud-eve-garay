// File: lib/csvParser.ts

export interface EmployeeMetrics {
    nombre: string;
    Atendidas: number;
    'Tiempo Atencion': number;
    'Prom. T. Atención (min)': number;
    'Prom. T Ringing (seg)': number;
    'Q de Encuestas': number;
    NPS: number;
    SAT: number;
    RD: number;
    'Días Logueado': number;
    'Prom. Logueo': string;
    '% de Ready': number;
    '% de ACD': number;
    '% de No Disp. Total': number;
    '% No Disp. No Productivo': number;
    '% No Disp. Productivo': number;
    'Promedio Calidad': number;
    'Ev. Actitudinal': string;
    'Prom. Llam. X hora en función de Tiempo de habla y No disponible': number;
    'Retención "Otros Fidelizables"': number;
    'Priorización': string;
  }
  
  const parsePercentage = (value: string): number => {
    return parseFloat(value.replace(',', '.').replace('%', ''));
  };
  
  const parseDecimal = (value: string): number => {
    return parseFloat(value.replace(',', '.'));
  };
  
  export const parseCSV = (content: string): EmployeeMetrics[] => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const employee: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        switch(header) {
          case 'GENERAL MAYO':
            employee.nombre = value;
            break;
          case 'Atendidas':
          case 'Tiempo Atencion':
          case 'Q de Encuestas':
          case 'NPS':
          case 'Días Logueado':
          case 'Promedio Calidad':
            employee[header] = parseInt(value);
            break;
          case 'Prom. T. Atención (min)':
          case 'Prom. T Ringing (seg)':
          case 'Prom. Llam. X hora en función de Tiempo de habla y No disponible':
            employee[header] = parseDecimal(value);
            break;
          case 'SAT':
          case 'RD':
          case '% de Ready':
          case '% de ACD':
          case '% de No Disp. Total':
          case '% No Disp. No Productivo':
          case '% No Disp. Productivo':
          case 'Retención "Otros Fidelizables"':
            employee[header] = parsePercentage(value);
            break;
          case 'Prom. Logueo':
          case 'Ev. Actitudinal':
          case 'Priorización':
            employee[header] = value;
            break;
        }
      });
  
      return employee as EmployeeMetrics;
    });
  };