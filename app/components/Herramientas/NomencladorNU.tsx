'use client'
import React, { useState, useEffect } from 'react';

interface Practice {
  descripcion: string;
  comoPedirse: string;
  codigo: string;
  nucodigo: string;
  observaciones: string;
}

const initialPractices: Practice[] = [
  { descripcion: "ERITROSEDIMENTACION", comoPedirse: "VSG - ERITRO - ESG", codigo: "660297", nucodigo: "297", observaciones: "" },
  { descripcion: "ORINA COMPLETA", comoPedirse: "SEDIMENTO URINARIO - O.C", codigo: "660711", nucodigo: "711", observaciones: "" },
  { descripcion: "CITOMEGALOVIRUS IGG", comoPedirse: "CMV", codigo: "661025", nucodigo: "1025", observaciones: "" },
  { descripcion: "CITOMEGALOVIRUS IGM", comoPedirse: "CMV", codigo: "661030", nucodigo: "1030", observaciones: "" },
  { descripcion: "HERPES SIMPLEX 1 IGM", comoPedirse: "HSV TIPO I", codigo: "666050", nucodigo: "662087", observaciones: "" },
  { descripcion: "HERPES SIMPLEX 2 IGM", comoPedirse: "HSV TIPO II", codigo: "666076", nucodigo: "662090", observaciones: "" },
  { descripcion: "EPSTEIN BARR IGM", comoPedirse: "EBV", codigo: "661060", nucodigo: "1060", observaciones: "" },
  { descripcion: "EPSTEIN BARR, AC. IGG/TOTALES", comoPedirse: "EBV", codigo: "661055", nucodigo: "1055", observaciones: "" },
  { descripcion: "RESISTENCIA A LA PROTEINA ACTIVADA", comoPedirse: "RPCA", codigo: "668828", nucodigo: "662331", observaciones: "" },
  { descripcion: "PROTEINOGRAMA ELECTROFORÉTICO", comoPedirse: "PXE", codigo: "660764", nucodigo: "764", observaciones: "" },
  { descripcion: "HEPATITIS B, ANTIGENO DE SUPERFICIE (AG. HBS)", comoPedirse: "HEPATITIS B - HEP. B - ANTIG. AUSTRALIANO", codigo: "661086", nucodigo: "1085", observaciones: "" },
  { descripcion: "HEPATITIS C, AC. IGG ANTI (HCV AC. IGG)", comoPedirse: "HEPATITIS C - ANTIC. HEPAT. C - AC. HEPAT. C o VHC", codigo: "661095", nucodigo: "1095", observaciones: "" },
  { descripcion: "HEPATITIS B, AC. - \"CORE\"IGG (RIA O ELISA)", comoPedirse: "HEPAT. AC. CORE - AC. CORE HEPAT. B", codigo: "665905", nucodigo: "665905", observaciones: "" },
  { descripcion: "GLUCEMIA PRUEBA DE SOBRECARGA (X2-2 DETERMINACIONES)", comoPedirse: "P75/PTOG/CURVA DE GLUCEMIA/TTOG", codigo: "660413", nucodigo: "413", observaciones: "" },
  { descripcion: "SATURACION TRANSFERRINA", comoPedirse: "TIBC", codigo: "660875", nucodigo: "662408", observaciones: "" },
  { descripcion: "GLUTAMIL TRANSPEPTIDASA", comoPedirse: "४GT/GGT", codigo: "660420", nucodigo: "420", observaciones: "" },
  { descripcion: "PROTROMBINA OWREN O DUCKERT", comoPedirse: "RIN", codigo: "660770", nucodigo: "770", observaciones: "" },
  { descripcion: "HEMOGLOBINA GLICOSILADA (HB A1C)", comoPedirse: "HB A 1C/ HB /", codigo: "661070", nucodigo: "1070", observaciones: "" },
  { descripcion: "TROMBOPLASTINA, TIEMPO DE (KPTT-TTPC-KT)", comoPedirse: "KPTT/KT/TTPC", codigo: "660887", nucodigo: "887", observaciones: "" },
  { descripcion: "PROTROMBINA TIEMPO", comoPedirse: "TP", codigo: "660771", nucodigo: "771", observaciones: "" },
  { descripcion: "TRIGLICERIDOS", comoPedirse: "TG/TGL", codigo: "660876", nucodigo: "876", observaciones: "" },
  { descripcion: "CREATINQUINASA-CPK", comoPedirse: "CPK", codigo: "660190", nucodigo: "190", observaciones: "" },
  { descripcion: "COLESTEROL TOTAL", comoPedirse: "CT", codigo: "660174", nucodigo: "174", observaciones: "" },
  { descripcion: "TIROGLOBULINA, AC. ULTRASENSIBLE", comoPedirse: "ATG (US)", codigo: "669443", nucodigo: "669460", observaciones: "" },
  { descripcion: "PEROXIDASA TIROIDEO, AC. ANTI- (ATPPO)", comoPedirse: "TPO/ATPO", codigo: "668315", nucodigo: "662031", observaciones: "" },
  { descripcion: "CELULAS LE", comoPedirse: "CE", codigo: "663546", nucodigo: "147", observaciones: "" },
  { descripcion: "ANTIBIOGRAMA (ATBG)", comoPedirse: "ATB", codigo: "660035", nucodigo: "35", observaciones: "" },
  { descripcion: "FOSFATASA ALCALINA", comoPedirse: "FAL", codigo: "660357", nucodigo: "357", observaciones: "" },
  { descripcion: "MONITOREO DE FARMACOS P/ENF.CRONICAS I (ANTICONVULSIVANTES I)", comoPedirse: "DOSAJE DE OXCARBAZEPINA/MONITOREO DE FARMACOS", codigo: "661135", nucodigo: "1135", observaciones: "" },
  { descripcion: "VITAMINA D3 (25-HIDROXICALCIFEROL O COLECALCIFEROL)", comoPedirse: "25 OHD/VIT D3", codigo: "669913", nucodigo: "662412", observaciones: "" },
  { descripcion: "VITAMINA D (1,25 - DIHIDROXICALCIFEROL)", comoPedirse: "VIT D", codigo: "669905", nucodigo: "669905", observaciones: "" },
  { descripcion: "TUMOR, NECROSIS FACTOR", comoPedirse: "TNF", codigo: "669747", nucodigo: "669747", observaciones: "" },
  { descripcion: "RECEPTORES HORMONALES INDICE DE PROLIFERACION", comoPedirse: "TRAB", codigo: "668813", nucodigo: "668813", observaciones: "" },
  { descripcion: "RECEPTOR DE TSH, AC. ANTI- (TRAB'S)", comoPedirse: "TRAB'S", codigo: "668802", nucodigo: "662033", observaciones: "" },
  { descripcion: "HLA DQ MOLECULAR", comoPedirse: "HLA MOLECULAR/HLA", codigo: "666401", nucodigo: "666401", observaciones: "" },
  { descripcion: "HEMOGRAMA COMPLETO", comoPedirse: "HG/CITOLOGICO", codigo: "660475", nucodigo: "475", observaciones: "" },
  { descripcion: "ANTIMULLERIANA, HORMONA (HAM)", comoPedirse: "HAM", codigo: "662790", nucodigo: "662411", observaciones: "" },
  { descripcion: "INDICE DE INSULINO RESISTENCIA HOMA", comoPedirse: "", codigo: "666708", nucodigo: "662397", observaciones: "" },
  { descripcion: "LATEX ARTRITIS REUMATOIDE CUALITATIVO", comoPedirse: "LATEX", codigo: "660598", nucodigo: "598", observaciones: "" },
  { descripcion: "ANTINUCLEARES ANTICUERPOS (FAN / ANA / AAN)", comoPedirse: "FAN", codigo: "660056", nucodigo: "56", observaciones: "" },
  { descripcion: "ANTIESTREPTOLISINAS \"O\" (ASO - ASTO - AELO), CUANTITATIVA", comoPedirse: "ASTO", codigo: "660051", nucodigo: "51", observaciones: "" },
  { descripcion: "PARASITOLOGICO EN MATERIA FECAL", comoPedirse: "PSMF", codigo: "660736", nucodigo: "736", observaciones: "" },
  { descripcion: "ANTICUERPOS ANTITIROGLOBULINA (ATG)", comoPedirse: "ANTI ATG", codigo: "660046", nucodigo: "46", observaciones: "" },
  { descripcion: "VITAMINA C (LIQUIDO SEMINAL)", comoPedirse: "VIT C", codigo: "669896", nucodigo: "669896", observaciones: "" },
  { descripcion: "CEA - ANTIGENO CARCINOEMBRIOGENICO (RIE)", comoPedirse: "CEA", codigo: "660144", nucodigo: "144", observaciones: "" },
  { descripcion: "LH - HORMONA LUTEINIZANTE", comoPedirse: "LH", codigo: "660612", nucodigo: "612", observaciones: "" },
  { descripcion: "PEPTIDO CITRULINADO CICLICO-AC. ANTI- IGG (AC.ANTI-CCP)", comoPedirse: "ANTI CCP", codigo: "668284", nucodigo: "668284", observaciones: "" },
  { descripcion: "GLUCEMIA (C/U)", comoPedirse: "GLUCOSA", codigo: "660412", nucodigo: "412", observaciones: "" },
  { descripcion: "BILIRRUBINEMIA TOTAL, DIRECTA E INDIRECTA", comoPedirse: "BIL T/D/IND", codigo: "660110", nucodigo: "110", observaciones: "" },
  { descripcion: "UREA, SERICA", comoPedirse: "UREMIA", codigo: "660902", nucodigo: "902", observaciones: "" },
  { descripcion: "URICO, ACIDO -SERICO", comoPedirse: "URICEMIA", codigo: "660904", nucodigo: "904", observaciones: "" },
  { descripcion: "BACTERIOLOGIA DIREC. -CULT. E IDENTICAC. DEL GERMEN", comoPedirse: "EXAMEN DE CULT.DIRECTO DE UÑA DE PIE", codigo: "660105", nucodigo: "105", observaciones: "Tambien puede ser solicitado como cultivo de orina" },
  { descripcion: "EXUDADO NASOFARINGEO, CULTIVO", comoPedirse: "EXUDADO FARINGOAMIGDALITIS", codigo: "660309", nucodigo: "309", observaciones: "" },
  { descripcion: "SCREENING NEONATAL(TSH NEON,FENI LALANINA Y TIR-BIODI", comoPedirse: "PESQUISA NEONATAL", codigo: "661196", nucodigo: "1196", observaciones: "En caso de que el bebé no esté dado de alta, durante el primer mes de vida se puede cargar a nombre de la mamá." },
  { descripcion: "ANTIGENO PROSTATICO TOTAL/LIBRE", comoPedirse: "PSA. L-PSA/PSA", codigo: "661000", nucodigo: "1000", observaciones: "" },
  { descripcion: "CARIOTIPO CON BANDEO - CITOGENETICO DE ALTA RESOLUCION (ALTA SENSIBILIDAD)", comoPedirse: "CARIOTIPO ALTA RESOLUCION", codigo: "663427", nucodigo: "663427", observaciones: "" },
  { descripcion: "CARDIOLIPINAS, AC.", comoPedirse: "ACA", codigo: "", nucodigo: "", observaciones: "Puede ser IGA/IGG/IGM" },
  { descripcion: "BANDAS OLIGOCLONALES, EN L.C.R./SUERO", comoPedirse: "BOC EN LCR Y SUERO", codigo: "662863", nucodigo: "662863", observaciones: "" },
  { descripcion: "PROGESTERONA", comoPedirse: "PG/PGR", codigo: "660758", nucodigo: "758", observaciones: "" },
  { descripcion: "MULTIRRESISTENCIA, VIGILANCIA DE BACTERIAS RESISTENTES", comoPedirse: "HISOPADO INGUIAL/AXILAR", codigo: "660684", nucodigo: "667626", observaciones: "el primer archivo es para nomeclador NM y el segundo para NU/NB" }
];

export default function MedicalPracticesDashboard() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPractice, setNewPractice] = useState<Practice>({
    descripcion: '',
    comoPedirse: '',
    codigo: '',
    nucodigo: '',
    observaciones: ''
  });

  useEffect(() => {
    // Cargar prácticas guardadas del localStorage al iniciar el componente
    const savedPractices = localStorage.getItem('medicalPractices');
    if (savedPractices) {
      setPractices(JSON.parse(savedPractices));
    } else {
      // Si no hay prácticas guardadas, usar las iniciales
      setPractices(initialPractices);
    }
  }, []);

  const filteredPractices = practices.filter(practice =>
    Object.values(practice).some(value =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddPractice = () => {
    const updatedPractices = [...practices, newPractice];
    setPractices(updatedPractices);
    // Guardar las prácticas actualizadas en localStorage
    localStorage.setItem('medicalPractices', JSON.stringify(updatedPractices));
    setNewPractice({
      descripcion: '',
      comoPedirse: '',
      codigo: '',
      nucodigo: '',
      observaciones: ''
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Practices Dashboard</h1>
      
      <input
        type="text"
        placeholder="Search practices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">DESCRIPCION</th>
              <th className="border border-gray-300 p-2 text-left">¿COMO PUEDE PEDIRSE?</th>
              <th className="border border-gray-300 p-2 text-left">CODIGO</th>
              <th className="border border-gray-300 p-2 text-left">NUCODIGO</th>
              <th className="border border-gray-300 p-2 text-left">OBSERVACIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredPractices.map((practice, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{practice.descripcion}</td>
                <td className="border border-gray-300 p-2">{practice.comoPedirse}</td>
                <td className="border border-gray-300 p-2">{practice.codigo}</td>
                <td className="border border-gray-300 p-2">{practice.nucodigo}</td>
                <td className="border border-gray-300 p-2">{practice.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Add New Practice</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <input
          placeholder="Descripción"
          value={newPractice.descripcion}
          onChange={(e) => setNewPractice({...newPractice, descripcion: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="¿Cómo puede pedirse?"
          value={newPractice.comoPedirse}
          onChange={(e) => setNewPractice({...newPractice, comoPedirse: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Código"
          value={newPractice.codigo}
          onChange={(e) => setNewPractice({...newPractice, codigo: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="NUCódigo"
          value={newPractice.nucodigo}
          onChange={(e) => setNewPractice({...newPractice, nucodigo: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Observaciones"
          value={newPractice.observaciones}
          onChange={(e) => setNewPractice({...newPractice, observaciones: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button 
        onClick={handleAddPractice}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Practice
      </button>
    </div>
  );
}