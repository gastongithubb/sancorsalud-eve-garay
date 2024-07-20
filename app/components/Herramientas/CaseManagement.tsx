'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface CaseDataAutorizaciones {
  caso: string;
  asociado: string;
  dni: string;
  tipoConsulta: string;
  detalleCaso: string;
}

interface CaseDataEmpresas {
  numeroCaso: string;
  convenio: string;
  internacion: boolean;
  cx: boolean;
  ambulatorio: boolean;
  descripcionCaso: string;
}

interface CaseDataF4 {
  fechaTurno: string;
  diagnostico: string;
  medico: string;
  practicaSolicitada: string;
  caso: string;
}

interface CaseData {
  autorizaciones: CaseDataAutorizaciones;
  empresas: CaseDataEmpresas;
  f4: CaseDataF4;
}

type FormatType = 'autorizaciones' | 'empresas' | 'f4';

const CaseManagement: React.FC = () => {
    const [format, setFormat] = useState<FormatType>('autorizaciones');
    const [caseData, setCaseData] = useState<CaseData>({
      autorizaciones: {
        caso: '',
        asociado: '',
        dni: '',
        tipoConsulta: '',
        detalleCaso: '',
      },
      empresas: {
        numeroCaso: '',
        convenio: '',
        internacion: false,
        cx: false,
        ambulatorio: false,
        descripcionCaso: '',
      },
      f4: {
        fechaTurno: '',
        diagnostico: '',
        medico: '',
        practicaSolicitada: '',
        caso: '',
      },
    });
  
    const handleFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setFormat(e.target.value as FormatType);
    };
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setCaseData((prevData) => ({
        ...prevData,
        [format]: {
          ...prevData[format],
          [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        } as CaseData[FormatType],
      }));
    };
  
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      let message = '';
      
      switch(format) {
        case 'autorizaciones':
          message = `✅ FORMATO PARA RECLAMO DE AUTORIZACIONES
  CASO: ${caseData.autorizaciones.caso}
  Asociado/a ${caseData.autorizaciones.asociado}
  DNI ${caseData.autorizaciones.dni}
  Consulta/reclama (${caseData.autorizaciones.tipoConsulta})
  ${caseData.autorizaciones.detalleCaso}`;
          break;
        case 'empresas':
          message = `⚠️ FORMATO EMPRESAS 🌐
  N° de Caso: ${caseData.empresas.numeroCaso}
  Convenio: ${caseData.empresas.convenio}
  Internación: ${caseData.empresas.internacion ? 'Sí' : 'No'}
  Cx: ${caseData.empresas.cx ? 'Sí' : 'No'}
  Ambulatorio: ${caseData.empresas.ambulatorio ? 'Sí' : 'No'}
  Descripción del caso: ${caseData.empresas.descripcionCaso}`;
          break;
        case 'f4':
          message = `📝 FORMATO F4 POR VALIDACIÓN PRACTICA ON-LINE
  1️⃣ Fecha de turno: ${caseData.f4.fechaTurno}
  2️⃣ DIAGNÓSTICO: ${caseData.f4.diagnostico}
  3️⃣ Médico/n° de matrícula: ${caseData.f4.medico}
  4️⃣ PRÁCTICA SOLICITADA: ${caseData.f4.practicaSolicitada}
  5️⃣ CASO: ${caseData.f4.caso}`;
          break;
      }

    const encodedMessage = encodeURIComponent(message);
    
    // Enlace del grupo de WhatsApp
    const whatsappGroupLink = 'https://chat.whatsapp.com/F7dfRGo8YMJ65iex37i8ZI';
    
    // Crear un elemento <a> temporal para abrir WhatsApp con el mensaje
    const tempLink = document.createElement('a');
    tempLink.href = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    tempLink.target = '_blank';
    tempLink.click();

    // Abrir el enlace del grupo en una nueva pestaña
    window.open(whatsappGroupLink, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Casos</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Formato:</label>
          <select
            value={format}
            onChange={handleFormatChange}
            className="w-full p-2 border rounded"
          >
            <option value="autorizaciones">Reclamo de Autorizaciones</option>
            <option value="empresas">Reclamo de Autorizaciones Formato Empresas</option>
            <option value="f4">Formato por rechazo de validacion Online</option>
          </select>
        </div>

        {format === 'autorizaciones' && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Formato para Reclamo de Autorizaciones</h2>
            <input
              type="text"
              name="caso"
              placeholder="CASO"
              value={caseData.autorizaciones.caso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="asociado"
              placeholder="Asociado/a"
              value={caseData.autorizaciones.asociado}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="dni"
              placeholder="DNI"
              value={caseData.autorizaciones.dni}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="tipoConsulta"
              placeholder="Tipo de consulta (Medicación/Cirugía/prótesis)"
              value={caseData.autorizaciones.tipoConsulta}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="detalleCaso"
              placeholder="Detalle del caso"
              value={caseData.autorizaciones.detalleCaso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
        )}

        {format === 'empresas' && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Reclamo de Autorizaciones Formato Empresas</h2>
            <input
              type="text"
              name="numeroCaso"
              placeholder="N° de Caso"
              value={caseData.empresas.numeroCaso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="convenio"
              placeholder="Convenio"
              value={caseData.empresas.convenio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="internacion"
                  checked={caseData.empresas.internacion}
                  onChange={handleChange}
                  className="mr-2"
                />
                Internación
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="cx"
                  checked={caseData.empresas.cx}
                  onChange={handleChange}
                  className="mr-2"
                />
                Cx
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="ambulatorio"
                  checked={caseData.empresas.ambulatorio}
                  onChange={handleChange}
                  className="mr-2"
                />
                Ambulatorio
              </label>
            </div>
            <textarea
              name="descripcionCaso"
              placeholder="Descripción del caso"
              value={caseData.empresas.descripcionCaso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
        )}

        {format === 'f4' && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Formato F4 por Validación Práctica On-Line</h2>
            <input
              type="text"
              name="fechaTurno"
              placeholder="Fecha de turno"
              value={caseData.f4.fechaTurno}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="diagnostico"
              placeholder="DIAGNÓSTICO"
              value={caseData.f4.diagnostico}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="medico"
              placeholder="Médico/n° de matrícula"
              value={caseData.f4.medico}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="practicaSolicitada"
              placeholder="PRÁCTICA SOLICITADA"
              value={caseData.f4.practicaSolicitada}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
            <input
              type="text"
              name="caso"
              placeholder="CASO"
              value={caseData.f4.caso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <motion.button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enviar al Grupo de WhatsApp
        </motion.button>
      </form>
    </div>
  );
};

export default CaseManagement;