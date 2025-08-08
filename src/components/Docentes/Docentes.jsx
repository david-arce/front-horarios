import React, { useState, useEffect } from "react";
import api from "../../services/api.js"; // Importa la instancia de axios configurada
import './Docentes.css';
const API_URL = "http://127.0.0.1:8000/docentes/"; 

const DocentesCRUD = () => {
  const [docentes, setDocentesLocal] = useState([]);
  const [form, setForm] = useState({
    id: null,
    cc: "",
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
  });

  const [editing, setEditing] = useState(false);

  // Obtener la lista de docentes
  const fetchDocentes = async () => {
    try {
      const response = await api.get(API_URL);
      setDocentesLocal(response.data);
    } catch (error) {
      console.error("Error al obtener los docentes:", error);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Crear nuevo docente
  const createDocente = async () => {
    try {
      await api.post(API_URL, form);
      fetchDocentes();
      setForm({ cc: "", nombres: "", apellidos: "", email: "", telefono: "" });
    } catch (error) {
      console.error("Error al crear el docente:", error);
    }
  };

  // Actualizar docente existente
  const updateDocente = async () => {
    try {
      const { id, ...data } = form; // extrae y quita el campo id
      await api.put(`${API_URL}${id}`, form);
      fetchDocentes();
      setEditing(false);
      setForm({ cc: "", nombres: "", apellidos: "", email: "", telefono: "" });
    } catch (error) {
      console.error("Error al actualizar el docente:", error);
    }
  };

  // Eliminar docente
  const deleteDocente = async (id) => {
    try {
      await api.delete(`${API_URL}${id}`);
      fetchDocentes();
    } catch (error) {
      console.error("Error al eliminar el docente:", error);
    }
  };

  // Seleccionar docente para editar
  const selectDocente = (docente) => {
    setForm(docente);
    setEditing(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Docentes</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editing ? updateDocente() : createDocente();
        }}
      >
        <input
          type="text"
          name="cc"
          placeholder="CC"
          value={form.cc}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={form.nombres}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
      </form>

      <h2>Lista de Docentes</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>CC</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((docente) => (
            <tr key={docente.id}>
              <td>{docente.cc}</td>
              <td>{docente.nombres}</td>
              <td>{docente.apellidos}</td>
              <td>{docente.email}</td>
              <td>{docente.telefono}</td>
              <td>
                <button onClick={() => selectDocente(docente)}>Editar</button>
                <button onClick={() => deleteDocente(docente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocentesCRUD;
