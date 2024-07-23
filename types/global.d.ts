declare module 'formidable' {
    export const IncomingForm: any;
  }
  
  declare module 'pdf-parse' {
    const pdfParse: (dataBuffer: Buffer) => Promise<{ text: string }>;
    export default pdfParse;
  }
  
  interface BalanceData {
    id: number;
    name: string;
    atendidas: number;
    tiempoAtencion: number;
    promTAtencion: number;
    promTRinging: number;
    qEncuestas: number;
    nps: number;
    sat: number;
    rdd: number;
    diasLogueado: string;
    promLogueo: number;
    porcReady: number;
    porcACD: number;
    porcNoDispTotal: number;
    porcNoDispNoProductivo: number;
    porcNoDispProductivo: number;
    promedioCalidad: number;
    evActitudinal: number;
    promLlamHora: number;
    retencionOtrosFidelizables: number;
    priorizacion: string;
  }