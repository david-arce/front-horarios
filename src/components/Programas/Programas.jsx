import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import "./Programas.css";

// Ajusta las URLs a tu conveniencia
const PROGRAMAS_URL = "http://127.0.0.1:8000/programas/";

const ProgramasCRUD = () => {
  const [programas, setProgramas] = useState([]);
  const [editing, setEditing] = useState(false);

  // Estado para el formulario de Programas
  // Se incluye `sedes_ids` para manejar la relación Many-to-Many
  const [form, setForm] = useState({
    id: null,
    codigo: "",
    nombre: "",
  });

  // 1. Obtener la lista de programas
  const fetchProgramas = async () => {
    try {
      const response = await api.get(PROGRAMAS_URL);
      setProgramas(response.data);
    } catch (error) {
      console.error("Error al obtener los programas:", error);
    }
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  // Manejar cambios en inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Crear un nuevo programa
  const createPrograma = async () => {
    try {
      // Suponiendo que tu backend espera { codigo, nombre, sedes_ids } 
      await api.post(PROGRAMAS_URL, form);
      fetchProgramas();
      // Limpiar formulario
      setForm({
        codigo: "",
        nombre: "",
      });
    } catch (error) {
      console.error("Error al crear el programa:", error);
    }
  };

  // Actualizar un programa existente
  const updatePrograma = async () => {
    try {
      const { id } = form;
      await api.put(`${PROGRAMAS_URL}${id}`, form);
      fetchProgramas();
      setEditing(false);
      // Limpiar formulario
      setForm({
        codigo: "",
        nombre: "",
      });
    } catch (error) {
      console.error("Error al actualizar el programa:", error);
    }
  };

  // Eliminar un programa
  const deletePrograma = async (id) => {
    try {
      await api.delete(`${PROGRAMAS_URL}${id}`);
      fetchProgramas();
    } catch (error) {
      console.error("Error al eliminar el programa:", error);
    }
  };

  // Seleccionar un programa para editar
  const selectPrograma = (programa) => {
    setForm({
      id: programa.id,
      codigo: programa.codigo,
      nombre: programa.nombre,
    });
    setEditing(true);
  };

  // Manejar submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    editing ? updatePrograma() : createPrograma();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Programas</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="codigo"
          placeholder="Código"
          value={form.codigo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
      </form>

      <h2>Lista de Programas</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {programas.map((programa) => (
            <tr key={programa.id}>
              <td>{programa.codigo}</td>
              <td>{programa.nombre}</td>
              <td>
                <button onClick={() => selectPrograma(programa)}>Editar</button>
                <button onClick={() => deletePrograma(programa.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramasCRUD;
