'use client'
import React, { useState, useEffect } from 'react';

interface Practice {
  descripcion: string;
  comoPedirse: string;
  codigo: string;
  observaciones: string;
}

const initialPractices: Practice[] = [
    { codigo: "010472", descripcion: "INFILTRACION /BLOQUEO DE COLUMNA/PERIRADICULAR BAJO RADIOSCOPIA", comoPedirse: "NEUROLISIS QUIMICA", observaciones: "" },
    { codigo: "010471", descripcion: "BLOQUEO PERIRRADICULAR BAJO TAC", comoPedirse: "BLOQUEO BAJO TAC/INFILTRACION BAJO TAC", observaciones: "" },
    { codigo: "010508", descripcion: "NEUROLISIS QUIMICAO BLOQUEO ANTIALGICO DE NERVIO PERIFERICO", comoPedirse: "BLOQUEO ANES.MOTOR", observaciones: "" },
    { codigo: "020371", descripcion: "INTRODUCC. DE SUSTANCIAS RETINIANAS (AVASTIN)", comoPedirse: "COLOC. AVASTIN/AVASTIN DOSIS..", observaciones: "" },
    { codigo: "020202 o 020301", descripcion: "BLEFAROPLASTIA/CONJUNTIVOPLASTIA", comoPedirse: "BLEFAROCTOMIA/CX PARPADOS/CX PTERIGION", observaciones: "" },
    { codigo: "020901", descripcion: "FOTOCOAGULACION CON YAG LASER", comoPedirse: "YAG LASER", observaciones: "" },
    { codigo: "020602", descripcion: "FOTOCOAGULACION CON RAYO LASER DE ARGON", comoPedirse: "FOTOCOAGULACION ARGON", observaciones: "" },
    { codigo: "020703", descripcion: "CAPSULOTOMIA", comoPedirse: "CAPSULOTOMIA C/YAG LASER", observaciones: "" },
    { codigo: "020774", descripcion: "CIRUGIA ALTA MIOPIA / LENSECTOMIA REFRACTIVA (LENTE FAQ", comoPedirse: "ICL", observaciones: "" },
    { codigo: "020770 o 020772", descripcion: "CIR. CATARATA C/PROV.LENTE P/PRESTADOR/CIR. CATARATA C/PROV.LENTE P/AMS", comoPedirse: "FACOEMULSIFICACIÓN/ CX CATARATA", observaciones: "" },
    { codigo: "020473", descripcion: "CIRUGIA REFRACTIVA(MIOPIA-ASTIGMAT.-HIPERMETROPIA)", comoPedirse: "EXCIMER LASER", observaciones: "" },
    { codigo: "030109", descripcion: "ESCISION DE LESION LOCALDE CONDUCTO AUDITIVO EXTERNO", comoPedirse: "CAE", observaciones: "" },
    { codigo: "060112", descripcion: "MARCACION PRE-QUIRURGICA DE NODULOS MAMARIOS", comoPedirse: "MARCACION CON CARBON ACTIVADO", observaciones: "" },
    { codigo: "070670", descripcion: "INYECCIONES ESCLEROSANTES DE VARICES", comoPedirse: "SESIONES ESCLEROSANTES/ESCLEROSIS DE VARICES", observaciones: "" },
    { codigo: "080212", descripcion: "PERITONEOCENTESIS EVACUADORA, DIAGNOSTICA O P/NEUMOPER.", comoPedirse: "PARACENTESIS EVACUADORA", observaciones: "" },
    { codigo: "108010", descripcion: "FOTO-ELECTROCOAGULACION LESIONES / CONDILOMAS", comoPedirse: "EXCERESIS O ESCICION DE CONDILOMAS (hombres)", observaciones: "" },
    { codigo: "100709", descripcion: "POSTIOPLASTIA (FIMOSIS) INCLUYE FRENULOTOMIA.", comoPedirse: "POSTECTOMIA", observaciones: "" },
    { codigo: "110283", descripcion: "COLOCACION DIU LIBERADOR DE HORMONAS", comoPedirse: "COLOCACION C/HORMONA o COLOCOCACION DIU MIRENA", observaciones: "" },
    { codigo: "110219", descripcion: "CONIZACION DE CUELLO POR LEEP", comoPedirse: "CONIZACION POR LEEP/ LEEP/CONIZACION CERVICAL", observaciones: "" },
    { codigo: "110211", descripcion: "RASPADO UTERINO DIAGNOSTICO,CON O SIN BIOPSIA DE CUELLO", comoPedirse: "LEC/BIOPSIA ENDOMETRIO", observaciones: "" },
    { codigo: "110314", descripcion: "ESCISION DE LABIOS MAYORES, LABIOS MENORES, ETC.", comoPedirse: "BIOPSIA DE VULVA/DRENAJE Y EXCERESIS DE GLANDULA DE BARTHOLINO", observaciones: "" },
    { codigo: "110215", descripcion: "ESCISION LOCAL DE LESION DE CUELLO (POLIPO).", comoPedirse: "BIOPSIA DE CERVIX", observaciones: "" },
    { codigo: "118001", descripcion: "BIOPSIA/ESCISION DE LESION POR LEEP", comoPedirse: "RESECCION C/LEEP/TOPICACIONES/EXCERESIS O ESCICION DE CONDILOMAS (mujeres)", observaciones: "" },
    { codigo: "130471", descripcion: "DERMATOSCOPIA DIGITAL Y/O DIAR D", comoPedirse: "DIAR D", observaciones: "" },
    { codigo: "130171", descripcion: "CRIOCIRUGIA DE PIEL", comoPedirse: "CRIOCIRUGIA", observaciones: "" },
    { codigo: "130172", descripcion: "CRIOTERAPIA DE LESIONES", comoPedirse: "RF/CRIO", observaciones: "" },
    { codigo: "130104", descripcion: "ESCISION LOCAL DE LESION DE PIEL O GLANDULA", comoPedirse: "ESCISION DE PIEL/BIOPSIA DE PIEL", observaciones: "" },
    { codigo: "140101", descripcion: "TESTIFICACION TOTAL", comoPedirse: "TEST DE ALERGIA", observaciones: "" },
    { codigo: "140173", descripcion: "TEST DE PARCHES CUTANEOS", comoPedirse: "TEST DE PARCHE CONTACTANTES", observaciones: "" },
    { codigo: "150106", descripcion: "CITOLOGIA EXFOLIATIVA ONCOLOGICA (PAP)", comoPedirse: "PAP", observaciones: "" },
    { codigo: "150175", descripcion: "CITOLOGIA DE PUNCION ASPIRACION CON AGUJA FINA", comoPedirse: "CITOLOGIA PAAF", observaciones: "" },
    { codigo: "150202", descripcion: "AC. MONOCLONALES C/TEC.INMUNOHISTOQUIM. O INMUNOMARCAC", comoPedirse: "KI67", observaciones: "" },
    { codigo: "150101", descripcion: "BIOPSIA POR INCISION O POR PUNCION (GANGLIO, ETC.)", comoPedirse: "ANATOMIA PATOLOGICA/ESTUDIO HISTOPATOLOGICO/BIOPSIA/BIOPSIA DUODENAL", observaciones: "" },
    { codigo: "160101", descripcion: "ANESTESIA MINIMA P/PROCEDIMIENTO DIAGNOSTICO", comoPedirse: "SEDACION/NLA/NEUROLEPTOANESTESIA", observaciones: "" },
    { codigo: "170120", descripcion: "MONIT.AMBULAT. DE TENSION ARTERIAL (PRESUROMETRIA)", comoPedirse: "MAPA", observaciones: "" },
    { codigo: "170101", descripcion: "ELECTROCARDIOGRAMA EN CONSULTORIO", comoPedirse: "ECG", observaciones: "" },
    { codigo: "170111/170171", descripcion: "ERGOMETRIA(HASTA 3 O 6 DERIVACIONES)/ERGOMETRIA COMP.(12 DERIVACIONES)", comoPedirse: "PEG", observaciones: "Si en el pedido no se aclara 12 derivaciones, se carga el de 3 o 6." },
    { codigo: "170178", descripcion: "VELOCIDAD DE ONDA DE PULSO (VOP) FUNCION ENDOTELIAL", comoPedirse: "VOP", observaciones: "" },
    { codigo: "170177", descripcion: "ELECTROCARDIOGRAMA (ECG) CON RIESGO QUIRURGICO", comoPedirse: "ECG QX/RQ", observaciones: "" },
    { codigo: "180302", descripcion: "ECOCARDIOG.DE STRESS FISICO Y/O FARMACOL.(C/IMAGEN DIG)", comoPedirse: "ECO STRESS", observaciones: "" },
    { codigo: "180272", descripcion: "ECODOPPLER DE LESIONES NODULARES (CUALQUIER ORGANO)", comoPedirse: "MAPA VASCULAR/ECOD. DE TIROIDES", observaciones: "Se carga solo cuando el diagnóstico es BOCIO, NODULO o este relacionado con tiroiditis." },
    { codigo: "180174", descripcion: "MONITOREO DE LA OVULACION (FOLICULAR)", comoPedirse: "MONITOREO OVULATORIO", observaciones: "" },
    { codigo: "180113", descripcion: "ECOGRAFIA HEPATO BILIAR, ESPLENICA O TORACICA", comoPedirse: "ECOG HIGADO", observaciones: "" },
    { codigo: "180104", descripcion: "ECOGRAFIA TOCOGINECOLOGICA CON O SIN TRASDUCTOR VAGINAL", comoPedirse: "ECOGRAFIA GINECOLOGICA", observaciones: "" },
    { codigo: "180114", descripcion: "ECOGRAFIA DE VEJIGA O PROSTATA C/S TRANSDUCTOR RECTAL", comoPedirse: "ECOG. VESICO PROSTATICA", observaciones: "" },
    { codigo: "180116", descripcion: "ECOGRAFIA RENAL BILATERAL", comoPedirse: "ECOG  VIAS URINARIAS", observaciones: "" },
    { codigo: "180172", descripcion: "PUNCION BIOPSIA ASPIRATIVA BAJO CONTROL ECOGRAFICO", comoPedirse: "PUNCION BAJO ECO/BIOPSIA BAJO ECO/PAAF/CORE BIOPSIA/TRUCUT", observaciones: "" },
    { codigo: "180274", descripcion: "ECODOPPLER POWER COLOR / ANGIO POWER", comoPedirse: "ECODOPPLER MANOS", observaciones: "" },
    { codigo: "180270", descripcion: "ECODOPPLER DE CORDON ESPERMATICO", comoPedirse: "ECODOPPLER TESTICULAR", observaciones: "" },
    { codigo: "180171", descripcion: "ECOGRAFIA TRANSVAGINAL", comoPedirse: "ECOGOGRAFIA ENDOVAGINAL/ECO TV/ECOGRAFIA GINECOLOGICA TV", observaciones: "" },
    { codigo: "180301", descripcion: "ECODOPPLER CARDIACO COLOR", comoPedirse: "ECOCARDIOGRAMA/DOPPLER CARDIACO", observaciones: "" },
    { codigo: "180186", descripcion: "TN PLUS 11-14 (ECO + MARCADORES)", comoPedirse: "ECOGRAMA CON MARCADORES/TNP PLUS/ ECOGRAFIA 11-14", observaciones: "" },
    { codigo: "180202", descripcion: "ECODOPPLER PERIFERICO COLOR", comoPedirse: "ECOD. CAROTIDEO/VENOSO/PERIFERICO/VASOS DEL CUELLO/RENAL C/DOPPLER", observaciones: "Cuando solicitan ecodoppler arterial y venoso va 180202 x 2" },
    { codigo: "180503", descripcion: "ECODOPPLER COLOR VASCULAR (CIRC. PLACENTARIA/ARTERIAS UTERINAS)", comoPedirse: "ECODOPPLER OBSTETRICO", observaciones: "" },
    { codigo: "200170", descripcion: "VIDEOENDOSCOPIA BAJA DIGESTIVA DIAGNOSTICA", comoPedirse: "VIDEOFIBROSCOPIA/VCC/COLONOFIBROSCOPIA SIN VIDEO", observaciones: "" },
    { codigo: "200171", descripcion: "VIDEOENDOSCOPIA ALTA DIGESTIVA DIAGNOSTICA", comoPedirse: "VEDA/VIDEO ALTA", observaciones: "" },
    { codigo: "220203", descripcion: "PSICOPROFILAXIS DEL PARTO METODO", comoPedirse: "CURSO DE PREPARTO", observaciones: "" },
    { codigo: "220202", descripcion: "MONITOREO FETAL", comoPedirse: "NST", observaciones: "" },
    { codigo: "220108", descripcion: "CEPILLADO EPITELIO VAGINALYCERVICAL P/DETEC.HPV CA SITU", comoPedirse: "CEPILLADO ENDOCERVICAL", observaciones: "" },
    { codigo: "240101", descripcion: "TRANSFUSION DE SANGRE HASTA 500 CM3", comoPedirse: "TRANSFUSION DE SANGRE", observaciones: "" },
    { codigo: "250173", descripcion: "TEST CAMINATA (6')", comoPedirse: "TEST DE LA MARCHA", observaciones: "" },
    { codigo: "250175", descripcion: "BIOFEEBACK P/CONSTIPACION E INCONTINENCIA URINARIA", comoPedirse: "REHABILITACION SUELO PELVICO", observaciones: "" },
    { codigo: "250183", descripcion: "SESION FISIOKINESIOTERAPIA (MODULO)", comoPedirse: "SESIONES DE ULTRASONIDO", observaciones: "" },
    { codigo: "260102", descripcion: "ESTUDIO COMPLETO DE LA FUNCION TIROIDEA CON I 131", comoPedirse: "I131", observaciones: "" },
    { codigo: "260231", descripcion: "SPECT CARD. PERF. C/T. 201 ESFUERZO Y REDISTRIBUCION", comoPedirse: "SPECT/ SPECT CARDIACO/ SPECT CON ESFUERZO", observaciones: "" },
    { codigo: "260508 x 1 y 260509 x 6", descripcion: "CENTELLOGRAMA OSEO (A CABEZAL FIJO-CAMARA GAMMA)", comoPedirse: "CENTELLOGRAMA/GAMMAGRAFIA", observaciones: "" },
    { codigo: "260528", descripcion: "PERFUSION SANGUINEA MIOCARDICA CON RADIOISOTOPOS", comoPedirse: "PERFUSIÓN MIOCARDICA", observaciones: "" },
    { codigo: "260272", descripcion: "TOMOGRAFIA POR EMISION DE POSITRONES (PET) (T.A.C.)", comoPedirse: "PET", observaciones: "" },
    { codigo: "260108", descripcion: "TRATAMIENTO DE CARCINOMA DE TIROIDES + M1 IODO", comoPedirse: "DOSIS PARA IODO", observaciones: "" },
    { codigo: "260370", descripcion: "TEST DE AIRE ASPIRADO EN UREA / HP FAST (H. PYLORI)", comoPedirse: "TEST AIRE ESPIRADO PARA HELICOBACTER PYLORI", observaciones: "" },
    { codigo: "280172", descripcion: "CAPACIDAD DE DIFUSION", comoPedirse: "DLCO", observaciones: "" },
  { codigo: "280175", descripcion: "ESTUDIO HIDROGENO ESPIRADO / TEST INTOLERANCIA LACTOSA, FRUCTOSA, ETC", comoPedirse: "SIBO/TEST DE ALIENTO", observaciones: "" },
  { codigo: "280102", descripcion: "ESPIROMETRIA ANTES Y DESPUES DE USO DE BRONCODILATADOR.", comoPedirse: "ESP. CON RTA B2", observaciones: "" },
  { codigo: "290112", descripcion: "HOLTER EEG DIGITAL / PROLONGADO BAJO SUEÑO / VIGILIA", comoPedirse: "EEG", observaciones: "" },
  { codigo: "290111", descripcion: "POTENCIALES EVOCADOS DE CUALQ. VIA CONDUCCION O SENTIDO", comoPedirse: "VERA", observaciones: "" },
  { codigo: "300102", descripcion: "CAMPO VISUAL (CAMPIMETRIA Y/O PERIMETRIA) BILATERAL", comoPedirse: "CVC", observaciones: "" },
  { codigo: "300204", descripcion: "TOPOGRAFIA CORNEAL BILATERAL", comoPedirse: "TMS-5", observaciones: "" },
  { codigo: "300112", descripcion: "RETINOGRAFIA BILATERAL.", comoPedirse: "RF/DAYTONA", observaciones: "" },
  { codigo: "300286", descripcion: "INTERFEROMETRIA DE COHERENCIA PARCIAL - BIOMETRIA OPTICA DE NO CONTACTO - UNILATERAL (IOL MASTER) - LENSTAR", comoPedirse: "IOL/IOL MASTER", observaciones: "" },
  { codigo: "300119", descripcion: "OFTALMOSCOPIA INDIREC.BINOCULAR C/ESQUEMA D/FONDO D/OJO", comoPedirse: "OBI", observaciones: "" },
  { codigo: "300274", descripcion: "REFRACTOMETRIA COMPUTARIZADA (BILATERAL)", comoPedirse: "ARM COMPUTARIZADA", observaciones: "" },
  { codigo: "300120", descripcion: "ESTUDIO DE FIJACION EN EL ESTRABISMO (CON VISUSCOPIO)", comoPedirse: "ESTUDIO SENSORIO MOTOR/ESTUDIO SENSORIAL/VISUS", observaciones: "" },
  { codigo: "310172", descripcion: "OTOEMISIONES ACUSTICAS", comoPedirse: "OEA", observaciones: "" },
  { codigo: "310185", descripcion: "RINOFIBROVIDEOLARINGOSCOPIA", comoPedirse: "RNF", observaciones: "" },
  { codigo: "310124", descripcion: "FARINGO LARINGO FIBROSCOPIA", comoPedirse: "FL/VIDEOENDOSCOPIA DE NARIZ", observaciones: "En algunas localidades ya no se realiza la FL por eso se carga directamente la video" },
  { codigo: "310179", descripcion: "VIDEOENDOSCOPIA DE NARIZ", comoPedirse: "VIDEOENDOSCOPIA DE NARIZ", observaciones: "" },
  { codigo: "310110", descripcion: "EXAMEN FUNCIONAL DE NARIZ (RINOMANOMETRIA)", comoPedirse: "RINODEBITOMANOMETRIA", observaciones: "" },
  { codigo: "330112", descripcion: "PRUEBAS PROYECTIVAS. PERFIL DE PERSONALIDAD", comoPedirse: "TEST NEUROCOGNITIVO", observaciones: "" },
  { codigo: "342081", descripcion: "TRACTOGRAFIA (R.M.N.)", comoPedirse: "DIFUSION RMN", observaciones: "" },
  { codigo: "340214", descripcion: "MEDICION COMP. MIEMBROS INFERIORES / ESCANOGRAMA / PANGONOGRAMA", comoPedirse: "TELEMETRIA", observaciones: "" },
  { codigo: "340201", descripcion: "RADIOGRAFIA DEL CRANEO, CARA, SENOS PARANASALES O CAVUN", comoPedirse: "RX SPN", observaciones: "En caso de solicitarse frente y perfil, corresponde sumarle el codigo 340202" },
  { codigo: "341072", descripcion: "TOMOGRAFIA DE COHERENCIA OPTICA BILATERAL (OCT) (T.A.C.)", comoPedirse: "OCT", observaciones: "" },
  { codigo: "341010", descripcion: "TOMOGRAFIA TORACICA (T.A.C.)", comoPedirse: "TAC TORAX/TAC PULMONAR", observaciones: "" },
  { codigo: "341012", descripcion: "TOMOGRAFIA DE OTROS ORGANOS Y REGIONES (T.A.C.)", comoPedirse: "TAC RODILLA, TOBILLO, HOMBRO, MUÑECA, ETC.", observaciones: "" },
  { codigo: "341090", descripcion: "ANGIOVUE (ANGIOGRAFIA POR OCT NO INVASIVA)", comoPedirse: "ANGIO OCT", observaciones: "" },
  { codigo: "342009", descripcion: "RESONANCIA HEPATOBILIAR ESPLENICA PANCREATICA", comoPedirse: "RMN HIGADO", observaciones: "" },
  { codigo: "342001", descripcion: "RESONANCIA CEREBRAL", comoPedirse: "RMN ENCEFALO", observaciones: "" },
  { codigo: "340209 + 340210", descripcion: "RADIOGRAFIA DE COLUMNA/RADIOGRAFIA DE COLUMNA POR CADA EXPOSICION SUBSIGUIENTE", comoPedirse: "RAQUIS FRENTE Y PERFIL", observaciones: "" },
  { codigo: "341201", descripcion: "DENSITOMETRIA OSEA TOTAL", comoPedirse: "DMO", observaciones: "" },
  { codigo: "342080", descripcion: "RESONANCIA OTROS ORGANOS-REGIONES (R.M.N.)", comoPedirse: "RMN SACROILIACA/RMN BRAZO/PIERNA/PIE/ANTEBRAZO/MUSLO/RMN ADC (angulo ponto cerebeloso)/RMN CAI (conducto aud. interno)", observaciones: "" },
  { codigo: "342013 x 2", descripcion: "RESONANCIA DE COLUMNA (R.M.N.)", comoPedirse: "RMN SACROCOXIGEA", observaciones: "" },
  { codigo: "342014", descripcion: "RESONANCIA DE ARTICULACIONES (R.M.N.)", comoPedirse: "RMN RODILLA, HOMBRO, TOBILLO, MUÑECA, CODO.", observaciones: "" },
  { codigo: "342078", descripcion: "RESONANCIA DE CORAZON MORFOLOGICA Y FUNCIONAL (R.M.N.)", comoPedirse: "RESONANCIA CARDIACA", observaciones: "" },
  { codigo: "350305", descripcion: "RADIOTERAPIA CONFORMADA TRIDIMENS.P/TRAT. CA", comoPedirse: "RT/RADIOTERAPIA/RT 3D", observaciones: "" },
  { codigo: "380101", descripcion: "PUVATERAPIA / FOTOTERAPIA", comoPedirse: "UBV", observaciones: "" },
  { codigo: "380273", descripcion: "GOTEO / INFUSION HIERRO - ATB U OTRAS SUSTANCIAS (NO ONCOLOGICO)", comoPedirse: "GOTEO/IFUSION", observaciones: "" },
  { codigo: "380170", descripcion: "TRATAMIENTO DEL DOLOR.", comoPedirse: "NEUROPROLOTERAPIA", observaciones: "" },
  { codigo: "380270", descripcion: "QUIMIOTERAPIA", comoPedirse: "QT/TRATAMIENTO ONCOLOGICO", observaciones: "" },
  { codigo: "380471", descripcion: "DROGADICCION HOSP. DE MEDIO DIA (4 HS.). MODULO 2", comoPedirse: "MODULO DROGADICCION", observaciones: "En caso de solicitar jornada completa corresponde código NM 380472" },
  { codigo: "380570", descripcion: "TRATAMIENTO MENSUAL ANOREXIA / BULIMA", comoPedirse: "MODULO ANOREXIA", observaciones: "" },
  { codigo: "380571", descripcion: "TRATAMIENTO MENSUAL AMBULATORIO TRASTORNOS DE CONDUCTA ALIMENTARIA (DESNUTRICION, OBESIDAD, ETC)", comoPedirse: "MODULO OBESIDAD", observaciones: "" },
  { codigo: "430175", descripcion: "SALA / MODULO DE RECUPERACION", comoPedirse: "SALA DE RECUPERACION/INTERNACION", observaciones: "No se carga ese codigo solo, debe estar relacionado a otro código principal." }
];

export default function MedicalPracticesDashboard() {
    const [practices, setPractices] = useState<Practice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newPractice, setNewPractice] = useState<Practice>({
      descripcion: '',
      comoPedirse: '',
      codigo: '',
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
                <th className="border border-gray-300 p-2 text-left">OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredPractices.map((practice, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{practice.descripcion}</td>
                  <td className="border border-gray-300 p-2">{practice.comoPedirse}</td>
                  <td className="border border-gray-300 p-2">{practice.codigo}</td>
                  <td className="border border-gray-300 p-2">{practice.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <h2 className="text-xl font-bold mt-8 mb-4">Add New Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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