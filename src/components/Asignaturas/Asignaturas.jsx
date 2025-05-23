import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Asignaturas.css";

const ASIGNATURAS_URL = "http://127.0.0.1:8000/asignaturas/";
const PROGRAMAS_URL = "http://127.0.0.1:8000/programas/";
const DOCENTES_URL = "http://127.0.0.1:8000/docentes/";

const AsignaturasCRUD = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [editing, setEditing] = useState(false);

  // Estado para el formulario de asignaturas
  const [form, setForm] = useState({
    id: null,
    codigo: "",
    nombre: "",
    intensidad: "",
    grupo: "",
    cohorte: "",
    aula: "",
    jornada: "",
    cant_estudiantes: "",
    semestre: "",
    plan: "",
    programa_id: "",
    docente_id: []
  });

  // Obtener la lista de asignaturas
  const fetchAsignaturas = async () => {
    try {
      const response = await axios.get(ASIGNATURAS_URL);
      setAsignaturas(response.data);
    } catch (error) {
      console.error("Error al obtener las asignaturas:", error);
    }
  };

  // Obtener la lista de programas
  const fetchProgramas = async () => {
    try {
      const response = await axios.get(PROGRAMAS_URL);
      setProgramas(response.data);
    } catch (error) {
      console.error("Error al obtener los programas:", error);
    }
  };

  // Obtener la lista de docentes
  const fetchDocentes = async () => {
    try {
      const response = await axios.get(DOCENTES_URL);
      setDocentes(response.data);
    } catch (error) {
      console.error("Error al obtener los docentes:", error);
    }
  };

  useEffect(() => {
    fetchAsignaturas();
    fetchProgramas();
    fetchDocentes();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  

  // Crear una nueva asignatura
  const createAsignatura = async () => {
    try {
      await axios.post(ASIGNATURAS_URL, form);
      fetchAsignaturas();
      // Ya NO limpiamos el formulario automáticamente
    } catch (error) {
      console.error("Error al crear la asignatura:", error);
    }
  };
  // const createAsignatura = async () => {
  //   try {
  //     await axios.post(ASIGNATURAS_URL, form);
  //     fetchAsignaturas();
  //     // Limpiar formulario
  //     setForm({
  //       codigo: "",
  //       nombre: "",
  //       intensidad: "",
  //       grupo: "",
  //       cohorte: "",
  //       aula: "",
  //       jornada: "",
  //       cant_estudiantes: "",
  //       semestre: "",
  //       plan: "",
  //       programa_id: "",
  //       docentes: []
  //     });
  //   } catch (error) {
  //     console.error("Error al crear la asignatura:", error);
  //   }
  // };

  // Actualizar una asignatura existente
  const updateAsignatura = async () => {
    try {
      const { id } = form;
      await axios.put(`${ASIGNATURAS_URL}${id}`, form);
      fetchAsignaturas();
      setEditing(false);
      // Limpiar formulario
      setForm({
        codigo: "",
        nombre: "",
        intensidad: "",
        grupo: "",
        cohorte: "",
        aula: "",
        jornada: "",
        cant_estudiantes: "",
        semestre: "",
        plan: "",
        programa_id: "",
        docente_id: []
      });
    } catch (error) {
      console.error("Error al actualizar la asignatura:", error);
    }
  };

  // Eliminar una asignatura
  const deleteAsignatura = async (id) => {
    try {
      await axios.delete(`${ASIGNATURAS_URL}${id}`);
      fetchAsignaturas();
    } catch (error) {
      console.error("Error al eliminar la asignatura:", error);
    }
  };

  const limpiarFormulario = () => {
    setForm({
      id: null,
      codigo: "",
      nombre: "",
      intensidad: "",
      grupo: "",
      cohorte: "",
      aula: "",
      jornada: "",
      cant_estudiantes: "",
      semestre: "",
      plan: "",
      programa_id: "",
      docente_id: []
    });
    setEditing(false);
  };

  // Seleccionar asignatura para editar
  const selectAsignatura = (asignatura) => {
    setForm({
      ...asignatura,
      docente_id: (asignatura.docentes || []).map((doc) => doc.id),
    });
    setEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editing ? updateAsignatura() : createAsignatura();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD de Asignaturas</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
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
        <input
          type="text"
          name="intensidad"
          placeholder="Intensidad"
          value={form.intensidad}
          onChange={handleChange}
        />
        <input
          type="text"
          name="grupo"
          placeholder="Grupo"
          value={form.grupo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cohorte"
          placeholder="Cohorte"
          value={form.cohorte}
          onChange={handleChange}
        />
        <input
          type="text"
          name="aula"
          placeholder="Aula"
          value={form.aula}
          onChange={handleChange}
        />
        <select
          name="jornada"
          value={form.jornada}
          onChange={handleChange}
        >
          <option value="">Selecciona una jornada</option>
          <option value="diurna">diurna</option>
          <option value="nocturna">nocturna</option>
        </select>
        <input
          type="number"
          name="cant_estudiantes"
          placeholder="Cantidad de Estudiantes"
          value={form.cant_estudiantes}
          onChange={handleChange}
        />
        <select
          name="semestre"
          value={form.semestre}
          onChange={handleChange}
        >
          <option value="">Selecciona un semestre</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="3">4</option>
          <option value="3">5</option>
          <option value="3">6</option>
          <option value="3">7</option>
          <option value="3">8</option>
          <option value="3">9</option>
          <option value="3">10</option>
        </select>
        <input
          type="text"
          name="plan"
          placeholder="Plan"
          value={form.plan}
          onChange={handleChange}
        />

        {/* Dropdown para seleccionar programa dinámicamente */}
        <select
          name="programa_id"
          value={form.programa_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un programa</option>
          {programas.map((programa) => (
            <option key={programa.id} value={programa.id}>
              {programa.nombre}
            </option>
          ))}
        </select>

        {/* Dropdown para seleccionar docente dinámicamente */}
        <select
          name="docentes"
          multiple
          value={form.docentes}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions, (option) => option.value);
            setForm((prev) => ({ ...prev, docentes: options }));
          }}
        >
          {docentes.map((docente) => (
            <option key={docente.id} value={docente.id}>
              {docente.nombres} {docente.apellidos}
            </option>
          ))}
        </select>

        <button type="submit">{editing ? "Actualizar" : "Crear"}</button>

        <button type="button" onClick={limpiarFormulario} style={{ marginLeft: "10px" }}>
          Limpiar formulario
        </button>

      </form>

      <h2>Lista de Asignaturas</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Intensidad</th>
            <th>Grupo</th>
            <th>Cohorte</th>
            <th>Docente</th>
            <th>Aula</th>
            <th>Jornada</th>
            <th>Cant. Estudiantes</th>
            <th>Semestre</th>
            <th>Plan</th>
            <th>Programa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.map((asignatura) => (
            <tr key={asignatura.id}>
              <td>{asignatura.codigo}</td>
              <td>{asignatura.nombre}</td>
              <td>{asignatura.intensidad}</td>
              <td>{asignatura.grupo}</td>
              <td>{asignatura.cohorte}</td>
              {/* obtener los nombres del docente */}
              <td>
                {asignatura.docentes?.map((d) => `${d.nombres} ${d.apellidos}`).join(", ")}
              </td>
              {/* <td>{asignatura.docente_id}</td> */}
              <td>{asignatura.aula}</td>
              <td>{asignatura.jornada}</td>
              <td>{asignatura.cant_estudiantes}</td>
              <td>{asignatura.semestre}</td>
              <td>{asignatura.plan}</td>
              {/* obtener el nombre del programa */}
              <td>{programas.find((p) => p.id === asignatura.programa_id)?.nombre}</td>
              {/* <td>{asignatura.programa_id}</td> */}
              <td>
                <button onClick={() => selectAsignatura(asignatura)}>Editar</button>
                <button onClick={() => deleteAsignatura(asignatura.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsignaturasCRUD;
