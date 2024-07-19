'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CaseData {
  caseNumber: string;
  table: 'Derivar' | 'Cerrar';
  area: string;
  customArea: string;
  reason: string;
}

const CaseManagement: React.FC = () => {
  const [caseData, setCaseData] = useState<CaseData>({
    caseNumber: '',
    table: 'Derivar',
    area: '',
    customArea: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCaseData(prevData => ({
      ...prevData,
      [name]: value,
      ...(name === 'table' && value === 'Cerrar' ? { area: '', customArea: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let message = '';
    if (caseData.table === 'Derivar') {
      const selectedArea = caseData.area === 'Otro' ? caseData.customArea : caseData.area;
      message = `Hola Eve, te paso el caso: ${caseData.caseNumber} donde corresponde ${caseData.table} al área de ${selectedArea} ya que ${caseData.reason}`;
    } else {
      message = `Hola Eve, te paso el caso: ${caseData.caseNumber} donde corresponde ${caseData.table} ya que ${caseData.reason}`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular una carga
    
    window.open(`https://api.whatsapp.com/send?phone=5493513818385&text=${encodedMessage}`, '_blank');

    setCaseData({
      caseNumber: '',
      table: 'Derivar',
      area: '',
      customArea: '',
      reason: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.h1 
        className="mb-8 text-4xl font-bold text-center text-[#1e1e1e]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Gestión de Casos
      </motion.h1>
      <motion.form 
        onSubmit={handleSubmit} 
        className="max-w-lg px-8 pt-6 pb-8 mx-auto mb-4 rounded-lg shadow-lg bg-neutral-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-6">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="caseNumber">
            Número de Caso
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="caseNumber"
            type="text"
            name="caseNumber"
            value={caseData.caseNumber}
            onChange={handleChange}
            required
            placeholder="Ej: CAS-12345"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="table">
            Acción
          </label>
          <div className="relative">
            <select
              className="block w-full px-3 py-2 pr-8 leading-tight text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="table"
              name="table"
              value={caseData.table}
              onChange={handleChange}
              required
            >
              <option value="Derivar">Derivar</option>
              <option value="Cerrar">Cerrar</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
              <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        {caseData.table === 'Derivar' && (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="area">
              Área
            </label>
            <div className="relative">
              <select
                className="block w-full px-3 py-2 pr-8 leading-tight text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="area"
                name="area"
                value={caseData.area}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un área</option>
                <option value="Autorizaciones">Autorizaciones</option>
                <option value="Medicamentos">Medicamentos</option>
                <option value="Afiliaciones">Afiliaciones</option>
                <option value="Pagos">Pagos</option>
                <option value="Cobranzas">Cobranzas</option>
                <option value="Liquidaciones">Liquidaciones</option>
                <option value="Auditoria de copagos">Auditoria de copagos</option>
                <option value="Otro">Otro</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        )}
        {caseData.table === 'Derivar' && caseData.area === 'Otro' && (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="customArea">
              Especifique el área
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="customArea"
              type="text"
              name="customArea"
              value={caseData.customArea}
              onChange={handleChange}
              required
              placeholder="Ingrese el área personalizada"
            />
          </div>
        )}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="reason">
            Motivo
          </label>
          <textarea
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="reason"
            name="reason"
            value={caseData.reason}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe brevemente el motivo..."
          />
        </div>
        <div className="flex items-center justify-center">
          <motion.button
            className={`px-6 py-3 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Gestión'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default CaseManagement;