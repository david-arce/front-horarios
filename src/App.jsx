import React from "react";
import DocentesCRUD from "./components/docentes/docentes.jsx";
import { Routes, Route, Router } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import AsignaturasCRUD from "./components/Asignaturas/Asignaturas.jsx";
import DisponibilidadCRUD from "./components/Disponibilidad/Disponibilidad.jsx";
import SedesCRUD from "./components/Sedes/Sedes.jsx";
import ProgramasCRUD from "./components/Programas/Programas.jsx";
import PeriodosCRUD from "./components/Periodos/Periodos.jsx";

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docentes" element={<DocentesCRUD />} />
        <Route path="/asignaturas" element={<AsignaturasCRUD />} />
        <Route path="/disponibilidad" element={<DisponibilidadCRUD />} />
        <Route path="/sedes" element={<SedesCRUD />} />
        <Route path="/programas" element={<ProgramasCRUD />} />
        <Route path="/periodos" element={<PeriodosCRUD />} />
      </Routes>
  
  );
}

export default App;
