
'use client'
import React, { useState } from 'react';

interface Practica {
  nombre: string;
  diasEspera: number;
}

const practicasIniciales: Practica[] = [
  { nombre: "Rehabilitación drogadependencia", diasEspera: 8 },
  { nombre: "Odontología - Ortodoncia", diasEspera: 5 },
  { nombre: "Odontología - Protesis Odontológicas", diasEspera: 5 },
  { nombre: "Fertilidad - Inicio de tratamiento", diasEspera: 20 },
  { nombre: "Fertilidad - Medicación (tratamiento iniciado)", diasEspera: 3 },
  { nombre: "Fertilidad - Medicación (tratamiento no iniciado)", diasEspera: 10 },
  { nombre: "Internación SIN Prótesis y SIN Presupuesto", diasEspera: 7 },
  { nombre: "Internación SIN Prótesis y CON Presupuesto", diasEspera: 10 },
  { nombre: "Internación CON Prótesis y SIN Presupuesto", diasEspera: 10 },
  { nombre: "Internación CON Prótesis y CON Presupuesto", diasEspera: 10 },
  { nombre: "Practica en ambulatorio CON Presupuesto y CON Protesis", diasEspera: 11 },
  { nombre: "Practica en ambulatorio CON Presupuesto y SIN Protesis", diasEspera: 8 },
  { nombre: "Practica en ambulatorio SIN Presupuesto y CON Protesis", diasEspera: 8 },
  { nombre: "Practica en ambulatorio SIN Presupuesto y SIN Protesis", diasEspera: 4 },
];

const PracticasEspera: React.FC = () => {
  const [practicas, setPracticas] = useState<Practica[]>(practicasIniciales);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(practicas[index].diasEspera.toString());
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const newPracticas = [...practicas];
      newPracticas[editIndex].diasEspera = parseInt(editValue, 10);
      setPracticas(newPracticas);
      setEditIndex(null);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#f0f4f8',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    borderRadius: '5px 5px 0 0',
  };

  const tdStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '12px',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const editButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#2ecc71',
    color: 'white',
  };

  const saveButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: 'white',
    marginRight: '5px',
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: 'white',
  };

  const inputStyle: React.CSSProperties = {
    width: '60px',
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Tiempos de Espera - Prácticas Médicas</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Práctica</th>
            <th style={{...thStyle, width: '150px'}}>Días de Espera</th>
            <th style={{...thStyle, width: '120px'}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {practicas.map((practica, index) => (
            <tr key={index}>
              <td style={tdStyle}>{practica.nombre}</td>
              <td style={tdStyle}>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  practica.diasEspera
                )}
              </td>
              <td style={tdStyle}>
                {editIndex === index ? (
                  <>
                    <button onClick={handleSave} style={saveButtonStyle}>Guardar</button>
                    <button onClick={handleCancel} style={cancelButtonStyle}>Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(index)} style={editButtonStyle}>Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PracticasEspera;