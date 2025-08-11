import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { getCurrentUser } from '../../services/authService';
import './home.css';

function Home() {
  const [horario, setHorario] = useState([]);
  const [role, setRole] = useState(null); // 'admin' | 'docente' | null

  // Extrae user_type del storage o del JWT
  const extractUserRole = () => {
    const u = getCurrentUser();
    if (!u) return null;
    if (u.user_type) return u.user_type;
    // intentar leer del access_token (JWT)
    if (u.access_token) {
      try {
        const base64 = u.access_token.split('.')[1];
        const json = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
        return json.user_type || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const refreshRole = () => setRole(extractUserRole());
    refreshRole();
    // si implementaste el evento 'auth:changed', lo escuchamos
    const onAuth = () => refreshRole();
    window.addEventListener('auth:changed', onAuth);
    window.addEventListener('storage', onAuth);
    return () => {
      window.removeEventListener('auth:changed', onAuth);
      window.removeEventListener('storage', onAuth);
    };
  }, []);

  const handleGenerarHorarios = async () => {
  try {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const token = user?.access_token;

    if (!token) {
      alert('No hay token. Inicia sesión nuevamente.');
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/generar-horarios', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al generar los horarios: ${response.status} ${text}`);
    }

    const result = await response.json();
    console.log('✅ Resultado:', result);
    if (result.horario) setHorario(result.horario);
    else console.error('❌ La respuesta del backend no contiene "horario"');

    alert('Horario generado correctamente');
  } catch (error) {
    console.error('❌ Error:', error);
    alert('Ocurrió un error al generar los horarios');
  }
  };


  const handleExportToExcel = () => {
    const data = [];
    for (const [course, slots] of Object.entries(horario)) {
      slots.forEach((slot) => {
        data.push({
          "Curso": course,
          "Día": slot.day,
          "Hora": slot.hour,
          "Docente": slot.teacher,
          "Aula": slot.classroom,
          "Semestre": slot.semester
        });
      });
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Horario");
    XLSX.writeFile(wb, "horarios_generados.xlsx");
  };

  return (
    <div className='container'>
      {/* Encabezado */}
      <header>
        <h1>Universidad del valle</h1>
        <h2>Sistema de automatización de horarios</h2>
      </header>

      {/* Botones de navegación (según rol) */}
      <div style={{ marginBottom: '20px' }}>
        {role === 'admin' && (
          <>
            <Link to="/docentes" className='button'>Docentes</Link>
            <Link to="/asignaturas" className='button'>Asignaturas</Link>
            <Link to="/disponibilidad" className='button'>Disponibilidad</Link>
            <Link to="/sedes" className='button'>Sedes</Link>
            <Link to="/programas" className='button'>Programas</Link>
            <Link to="/periodos" className='button'>Periodos</Link>
            <Link to="/aulas" className='button'>Aulas</Link>
          </>
        )}

        {role === 'docente' && (
          <Link to="/disponibilidad" className='button'>Disponibilidad</Link>
        )}
      </div>

      {/* Botón para generar horarios (solo admin) */}
      {role === 'admin' && (
        <button className='generate-button' onClick={handleGenerarHorarios}>
          Generar horarios
        </button>
      )}

      {Object.keys(horario).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Horario generado</h3>
          <button className='generate-button' onClick={handleExportToExcel}>
            Exportar a Excel
          </button>
          <table border="1" style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Docente</th>
                <th>Aula</th>
                <th>Semestre</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(horario).map(([course, slots]) =>
                slots.map((slot, index) => (
                  <tr key={`${course}-${index}`}>
                    <td>{course}</td>
                    <td>{slot.day}</td>
                    <td>{slot.hour}</td>
                    <td>{slot.teacher}</td>
                    <td>{slot.classroom}</td>
                    <td>{slot.semester}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
