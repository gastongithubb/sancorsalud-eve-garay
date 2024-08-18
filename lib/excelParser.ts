// File: lib/csvParser.ts

export interface EmployeeMetrics {
  nombre: string;
  Atendidas: number;
  TiempoAtencion: number;
  PromTAtencionMin: number;
  PromTRingingSeg: number;
  QdeEncuestas: number;
  NPS: number;
  SAT: number;
  RD: number;
  DiasLogueado: number;
  PromLogueo: string;
  PorcentajeReady: number;
  PorcentajeACD: number;
  PorcentajeNoDispTotal: number;
  PorcentajeNoDispNoProductivo: number;
  PorcentajeNoDispProductivo: number;
  PromedioCalidad: number;
  EvActitudinal: string;
  PromLlamXHora: number;
  Priorizacion: string;
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
    const employee: Partial<EmployeeMetrics> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      switch(header) {
        case 'GENERAL MAYO':
          employee.nombre = value;
          break;
        case 'Atendidas':
          employee.Atendidas = parseInt(value);
          break;
        case 'Tiempo Atencion':
          employee.TiempoAtencion = parseInt(value);
          break;
        case 'Prom. T. Atención (min)':
          employee.PromTAtencionMin = parseDecimal(value);
          break;
        case 'Prom. T Ringing (seg)':
          employee.PromTRingingSeg = parseDecimal(value);
          break;
        case 'Q de Encuestas':
          employee.QdeEncuestas = parseInt(value);
          break;
        case 'NPS':
          employee.NPS = parseInt(value);
          break;
        case 'SAT':
          employee.SAT = parsePercentage(value);
          break;
        case 'RD':
          employee.RD = parsePercentage(value);
          break;
        case 'Días Logueado':
          employee.DiasLogueado = parseInt(value);
          break;
        case 'Prom. Logueo':
          employee.PromLogueo = value;
          break;
        case '% de Ready':
          employee.PorcentajeReady = parsePercentage(value);
          break;
        case '% de ACD':
          employee.PorcentajeACD = parsePercentage(value);
          break;
        case '% de No Disp. Total':
          employee.PorcentajeNoDispTotal = parsePercentage(value);
          break;
        case '% No Disp. No Productivo':
          employee.PorcentajeNoDispNoProductivo = parsePercentage(value);
          break;
        case '% No Disp. Productivo':
          employee.PorcentajeNoDispProductivo = parsePercentage(value);
          break;
        case 'Promedio Calidad':
          employee.PromedioCalidad = parseDecimal(value);
          break;
        case 'Ev. Actitudinal':
          employee.EvActitudinal = value;
          break;
        case 'Prom. Llam. X hora en función de Tiempo de habla y No disponible':
          employee.PromLlamXHora = parseDecimal(value);
          break;
        case 'Priorización':
          employee.Priorizacion = value;
          break;
      }
    });

    return employee as EmployeeMetrics;
  });
};