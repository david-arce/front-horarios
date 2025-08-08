import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import './Disponibilidad.css';

const API_URL = "http://127.0.0.1:8000/disponibilidades/";
const DOCENTES_URL = "http://127.0.0.1:8000/docentes/";
const PERIODOS_URL = "http://127.0.0.1:8000/periodos/";

const DisponibilidadCRUD = () => {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    docente_id: "",
    periodo_id: "",
    dia: "",
    hora_inicio: "",
    hora_fin: ""
  });

  // Obtener la lista de disponibilidades
  const fetchDisponibilidades = async () => {
    try {
      const response = await api.get(API_URL);
      setDisponibilidades(response.data);
    } catch (error) {
      console.error("Error al obtener las disponibilidades:", error);
    }
  };

  // Obtener la lista de docentes
  const fetchDocentes = async () => {
    try {
      const response = await api.get(DOCENTES_URL);
      setDocentes(response.data);
    }
    catch (error) {
      console.error("Error al obtener los docentes:", error);
    }
  };

  // Obtener la lista de periodos
  const fetchPeriodos = async () => {
    try {
      const response = await api.get(PERIODOS_URL);
      setPeriodos(response.data);
    }
    catch (error) {
      console.error("Error al obtener los periodos:", error);
    }
  };

  useEffect(() => {
    fetchDisponibilidades();
    fetchDocentes();
    fetchPeriodos();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Crear una nueva disponibilidad
  const createDisponibilidad = async () => {
    try {
      await api.post(API_URL, form);
      fetchDisponibilidades();
      // setForm({
      //   docente_id: "",
      //   periodo_id: "",
      //   dia: "",
      //   hora_inicio: "",
      //   hora_fin: ""
      // });
    } catch (error) {
      console.error("Error al crear la disponibilidad:", error);
    }
  };

  // Actualizar una disponibilidad existente
  const updateDisponibilidad = async () => {
    try {
      const { id } = form;
      await api.put(`${API_URL}${id}`, form);
      fetchDisponibilidades();
      setEditing(false);
      setForm({
        docente_id: "",
        periodo_id: "",
        dia: "",
        hora_inicio: "",
        hora_fin: ""
      });
    } catch (error) {
      console.error("Error al actualizar la disponibilidad:", error);
    }
  };

  // Eliminar una disponibilidad
  const deleteDisponibilidad = async (id) => {
    try {
      await api.delete(`${API_URL}${id}`);
      fetchDisponibilidades();
    } catch (error) {
      console.error("Error al eliminar la disponibilidad:", error);
    }
  };

  // Seleccionar disponibilidad para editar
  const selectDisponibilidad = (disp) => {
    setForm(disp);
    setEditing(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Disponibilidad</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        editing ? updateDisponibilidad() : createDisponibilidad();
      }}>
        {/* Dropdown para seleccionar docente dinámicamente */}
        <select
          name="docente_id"
          value={form.docente_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un docente</option>
          {docentes.map((docente) => (
            <option key={docente.id} value={docente.id}>
              {docente.nombres} {docente.apellidos}
            </option>
          ))}
        </select>
        {/* Dropdown para seleccionar periodo dinámicamente */}
        <select
          name="periodo_id"
          value={form.periodo_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un periodo</option>
          {periodos.map((periodo) => (
            <option key={periodo.id} value={periodo.id}>
              {periodo.nombre}
            </option>
          ))}
        </select>
        <select
          name="dia"
          value={form.dia}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un día</option>
          <option value="Lunes">Lunes</option>
          <option value="Martes">Martes</option>
          <option value="Miércoles">Miércoles</option>
          <option value="Jueves">Jueves</option>
          <option value="Viernes">Viernes</option>
        </select>
        <input
          type="time"
          name="hora_inicio"
          placeholder="Hora de Inicio"
          value={form.hora_inicio}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="hora_fin"
          placeholder="Hora Fin"
          value={form.hora_fin}
          onChange={handleChange}
          required
        />
        <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
      </form>

      <h2>Lista de Disponibilidades</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Docente</th>
            <th>Periodo</th>
            <th>Día</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {disponibilidades.map((disp) => (
            <tr key={disp.id}>
              {/* obtener los nombres del docente */}
              <td>{docentes.find((d) => d.id === disp.docente_id)?.nombres} {docentes.find((d) => d.id === disp.docente_id)?.apellidos}</td>
              <td>{periodos.find((p) => p.id === disp.periodo_id)?.nombre}</td>
              <td>{disp.dia}</td>
              <td>{disp.hora_inicio}</td>
              <td>{disp.hora_fin}</td>
              <td>
                <button onClick={() => selectDisponibilidad(disp)}>Editar</button>
                <button onClick={() => deleteDisponibilidad(disp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisponibilidadCRUD;
