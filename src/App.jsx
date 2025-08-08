import React from "react";
import DocentesCRUD from "./components/docentes/docentes.jsx";
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import AsignaturasCRUD from "./components/Asignaturas/Asignaturas.jsx";
import DisponibilidadCRUD from "./components/Disponibilidad/Disponibilidad.jsx";
import SedesCRUD from "./components/Sedes/Sedes.jsx";
import ProgramasCRUD from "./components/Programas/Programas.jsx";
import PeriodosCRUD from "./components/Periodos/Periodos.jsx";
import AulasCRUD from "./components/Aulas/Aula.jsx";
import RegisterForm from "./components/Auth/RegisterForm.jsx";
import LoginForm from "./components/Auth/LoginForm.jsx";
import { getCurrentUser } from "./services/authService.js";
// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  return getCurrentUser() ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/docentes"
          element={
            <PrivateRoute>
              <DocentesCRUD />
            </PrivateRoute>
          }
        />
        <Route
          path="/asignaturas"
          element={
            <PrivateRoute>
              <AsignaturasCRUD />
            </PrivateRoute>
          }
        />
        <Route
          path="/disponibilidad"
          element={
            <PrivateRoute>
              <DisponibilidadCRUD />
            </PrivateRoute>
          }
        />
        <Route
          path="/sedes"
          element={
            <PrivateRoute>
              <SedesCRUD />
            </PrivateRoute>
          }
        />
        <Route
          path="/programas"
          element={
            <PrivateRoute>
              <ProgramasCRUD />
            </PrivateRoute>
          }
        />
        <Route
          path="/periodos"
          element={
            <PrivateRoute>
              <PeriodosCRUD />
            </PrivateRoute>
          }
        />
        <Route
          path="/aulas"
          element={
            <PrivateRoute>
              <AulasCRUD />
            </PrivateRoute>
          }
        />

        {/* Ruta catch-all para redirigir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

