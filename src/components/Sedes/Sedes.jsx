import React, { useState, useEffect } from "react";
import axios from "axios";
import './Sedes.css';

const API_URL = "http://127.0.0.1:8000/sedes/";

const SedesCRUD = () => {
  const [sedes, setSedes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: ""
  });
  const [editing, setEditing] = useState(false);

  // Obtener la lista de sedes
  const fetchSedes = async () => {
    try {
      const response = await axios.get(API_URL);
      setSedes(response.data);
    } catch (error) {
      console.error("Error al obtener las sedes:", error);
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Crear una nueva sede
  const createSede = async () => {
    try {
      await axios.post(API_URL, form);
      fetchSedes();
      setForm({ nombre: "" });
    } catch (error) {
      console.error("Error al crear la sede:", error);
    }
  };

  // Actualizar una sede existente
  const updateSede = async () => {
    try {
      const { id } = form;
      await axios.put(`${API_URL}${id}`, form);
      fetchSedes();
      setEditing(false);
      setForm({ nombre: "" });
    } catch (error) {
      console.error("Error al actualizar la sede:", error);
    }
  };

  // Eliminar una sede
  const deleteSede = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      fetchSedes();
    } catch (error) {
      console.error("Error al eliminar la sede:", error);
    }
  };

  // Seleccionar sede para editar
  const selectSede = (sede) => {
    setForm(sede);
    setEditing(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD de Sedes</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        editing ? updateSede() : createSede();
      }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la Sede"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
      </form>

      <h2>Lista de Sedes</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sedes.map((sede) => (
            <tr key={sede.id}>
              <td>{sede.nombre}</td>
              <td>
                <button onClick={() => selectSede(sede)}>Editar</button>
                <button onClick={() => deleteSede(sede.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SedesCRUD;
