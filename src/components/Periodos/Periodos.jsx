import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import './Periodos.css';

const API_URL = "http://127.0.0.1:8000/periodos/";

const PeriodosCRUD = () => {
    const [periodos, setPeriodos] = useState([]);
    const [form, setForm] = useState({
        id: null,
        nombre: "",
    });
    const [editing, setEditing] = useState(false);

    // Obtener la lista de periodos
    const fetchPeriodos = async () => {
        try {
            const response = await api.get(API_URL);
            setPeriodos(response.data);
        } catch (error) {
            console.error("Error al obtener los periodos:", error);
        }
    };  

    useEffect(() => {
        fetchPeriodos();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Crear un nuevo periodo
    const createPeriodo = async () => {
        try {
            await api.post(API_URL, form);
            fetchPeriodos();
            setForm({ nombre: "" });
        } catch (error) {
            console.error("Error al crear el periodo:", error);
        }
    };

    // Actualizar un periodo existente
    const updatePeriodo = async () => {
        try {
            const { id } = form;
            await api.put(`${API_URL}${id}`, form);
            fetchPeriodos();
            setEditing(false);
            setForm({ nombre: "" });
        } catch (error) {
            console.error("Error al actualizar el periodo:", error);
        }
    };

    // Eliminar un periodo
    const deletePeriodo = async (id) => {
        try {
            await api.delete(`${API_URL}${id}`);
            fetchPeriodos();
        } catch (error) {
            console.error("Error al eliminar el periodo:", error);
        }
    };

    // seleccionar un periodo para editar
    const selectPeriodo = (periodo) => {
        setForm(periodo);
        setEditing(true);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Periodos académicos</h1>
            <form onSubmit={(e)=>{
                e.preventDefault();
                editing ? updatePeriodo() : createPeriodo();
            }}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                />
                <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
            </form>

            <h2>Lista de periodos</h2>
            <table border="1" style={{ width: "100%", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {periodos.map((periodo) => (
                        <tr key={periodo.id}>
                            <td>{periodo.nombre}</td>
                            <td>
                                <button onClick={() => selectPeriodo(periodo)}>Editar</button>
                                <button onClick={() => deletePeriodo(periodo.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PeriodosCRUD;
