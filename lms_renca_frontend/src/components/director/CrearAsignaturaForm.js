import React, { useState, useEffect } from "react";
import directorService from "../../services/directorService";

function CrearAsignaturaForm() {
  const [nombre, setNombre] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [profesorRut, setProfesorRut] = useState("");
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosData = await directorService.obtenerCursos();
        setCursos(cursosData.cursos);
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    };

    const fetchProfesores = async () => {
      try {
        const profesoresData = await directorService.todosProfesores();
        setProfesores(profesoresData.profesores);
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
      }
    };

    fetchCursos();
    fetchProfesores();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await directorService.crearAsignatura({ nombre, curso_id: cursoId, profesor_rut: profesorRut });
      setNombre("");
      setCursoId("");
      setProfesorRut("");
      alert("Asignatura creada con éxito");
    } catch (error) {
      console.error("Error al crear la asignatura:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="cursoId">Curso:</label>
        <select
          id="cursoId"
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
        >
          <option value="">Selecciona un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="profesorRut">Profesor:</label>
        <select
          id="profesorRut"
          value={profesorRut}
          onChange={(e) => setProfesorRut(e.target.value)}
          required
        >
          <option value="">Selecciona un profesor</option>
          {profesores.map((profesor) => (
            <option key={profesor.rut} value={profesor.rut}>
              {profesor.nombre} {profesor.apellido}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Crear Asignatura</button>
    </form>
  );
}

export default CrearAsignaturaForm;