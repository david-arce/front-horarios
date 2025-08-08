import React, { useState, useEffect } from 'react';
import api from "../../services/api.js";
import './Aula.css';

const API_URL = "http://127.0.0.1:8000/aulas/";
const SEDE_URL = "http://127.0.0.1:8000/sedes/";

const AulaCRUD = () => {
  const [aulas, setAulas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    capacidad: "",
    tipo: "",
    sede_id: ""
  });
  const [editing, setEditing] = useState(false);
    // Obtener la lista de aulas
    const fetchAulas = async () => {
      try {
        const response = await api.get(API_URL);
        setAulas(response.data);
      } catch (error) {
        console.error("Error fetching aulas:", error);
      }
    };
    // Obtener la lista de sedes
    const fetchSedes = async () => {
      try {
        const response = await api.get(SEDE_URL);
        setSedes(response.data);
      } catch (error) {
        console.error("Error fetching sedes:", error);
      }
    };
    useEffect(() => {
      fetchAulas();
      fetchSedes();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };  
    // Crear una nueva aula
    const createAula = async () => {
        try {
            await api.post(API_URL, form);
            fetchAulas();
            setForm({ nombre: "", capacidad: "", tipo: "", sede_id: "" });
        } catch (error) {
            console.error("Error al crear el aula:", error);
        }
    };
    // Actualizar una aula existente
    const updateAula = async () => {
        try {
            await api.put(`${API_URL}${form.id}/`, form);
            fetchAulas();
            setForm({ nombre: "", capacidad: "", tipo: "", sede_id: "" });
            setEditing(false);
        } catch (error) {
            console.error("Error al actualizar el aula:", error);
        }
    };
    // Eliminar una aula
    const deleteAula = async (id) => {
        try {
            await api.delete(`${API_URL}${id}/`);
            fetchAulas();
        } catch (error) {
            console.error("Error al eliminar el aula:", error);
        }
    };
   
    // limpiar formulario
    const limpiarFormulario = () => {
        setForm({
            id: null,
            nombre: "",
            capacidad: "",
            tipo: "",
            sede_id: ""
        });
        setEditing(false);
    };
    // Seleccionar aula para editar
    const selectAula = (aula) => {
        setForm(aula);
        setEditing(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editing ? updateAula() : createAula();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Aulas</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="capacidad"
                    placeholder="Capacidad"
                    value={form.capacidad}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="tipo"
                    placeholder="Tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                />
                <select
                    name="sede_id"
                    value={form.sede_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione una sede</option>
                    {sedes.map((sede) => (
                        <option key={sede.id} value={sede.id}>
                            {sede.nombre}
                        </option>
                    ))}
                </select>
                <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={limpiarFormulario}>Limpiar</button>
            </form>
            <h2>Lista de Aulas</h2>
            <table border="1" style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Capacidad</th>
                        <th>Tipo</th>
                        <th>Sede</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {aulas.map((aula) => (
                        <tr key={aula.id}>
                            <td>{aula.nombre}</td>
                            <td>{aula.capacidad}</td>
                            <td>{aula.tipo}</td>
                            {/* obtener el nombre de la sede correspondiente */}
                            <td>{sedes.find(sede => sede.id === aula.sede_id)?.nombre || 'N/A'}</td>
                            <td>
                                <button onClick={() => selectAula(aula)}>Editar</button>
                                <button onClick={() => deleteAula(aula.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AulaCRUD;
