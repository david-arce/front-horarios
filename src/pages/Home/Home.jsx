import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './home.css';

function Home() {
  const [horario, setHorario] = useState([]);
  const handleGenerarHorarios = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/generar-horarios', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Error al generar los horarios');
      }

      const result = await response.json();
      console.log('✅ Resultado:', result);

      if (result.horario) {
        setHorario(result.horario);
      } else {
        console.error('❌ La respuesta del backend no contiene "horario"');
      }
      alert('Horario generado correctamente');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Ocurrió un error al generar los horarios');
    }
  };

  const handleExportToExcel = () => {
    const data = [];

    // Recorremos el horario y lo convertimos a formato adecuado para Excel
    for (const [course, slots] of Object.entries(horario)) {
      slots.forEach((slot) => {
        data.push({
          "Curso": course,
          "Día": slot.day,
          "Hora": slot.hour,
          "Docente": slot.teacher
        });
      });
    }

    // Crear un libro de trabajo de Excel con los datos
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Horario");

    // Guardar el archivo Excel
    XLSX.writeFile(wb, "horarios_generados.xlsx");
  };

  return (
    <div className='container'>
      {/* Encabezado */}
      <header>
        {/* Aquí podrías colocar tu logo si lo deseas */}
        <h1>Universidad del valle</h1>
        <h2>Sistema de automatización de horarios</h2>
      </header>

      {/* Botones de navegación */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/docentes" className='button'>Docentes</Link>
        <Link to="/asignaturas" className='button'>Asignaturas</Link>
        <Link to="/disponibilidad" className='button'>Disponibilidad</Link>
        <Link to="/sedes" className='button'>Sedes</Link>
        <Link to="/programas" className='button'>Programas</Link>
        <Link to="/periodos" className='button'>Periodos</Link>
      </div>

      {/* Botón para generar horarios */}
      <button className='generate-button' onClick={handleGenerarHorarios}>
        Generar horarios
      </button>

      {Object.keys(horario).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Horario generado</h3>
          <table border="1" style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Docente</th>
              </tr>
            </thead>
            <tbody>
              {/* Iteramos sobre los cursos y sus slots */}
              {Object.entries(horario).map(([course, slots]) => (
                slots.map((slot, index) => (
                  <tr key={`${course}-${index}`}>
                    <td>{course}</td>
                    <td>{slot.day}</td>
                    <td>{slot.hour}</td>
                    <td>{slot.teacher}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
          <button className='generate-button' onClick={handleExportToExcel}>
            Exportar a Excel
          </button>
        </div>
      )}
    </div>
  );
}

export default Home