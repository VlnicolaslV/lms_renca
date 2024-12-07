import React, { useState, useEffect } from 'react';
import directorService from '../../services/directorService';

function VerCursos() {
  const [cursos, setCursos] = useState([]);

  // Obtener los cursos

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosData = await directorService.obtenerCursos();
        setCursos(cursosData.cursos);  // Acceder a la propiedad 'cursos'
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
        // Manejar el error
      }
    };
    fetchCursos();
  }, []); 

  // Función para manejar la eliminación de un curso
  const handleDelete = async (id) => {
    try {
      await directorService.eliminarCurso(id);
      // Eliminar el curso de la lista local después de eliminarlo en la base de datos
      setCursos(cursos.filter((curso) => curso.id !== id));
      alert("Curso eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      alert("Error al eliminar el curso.");
    }
  };

  // Función para manejar la modificación de un curso (esto solo muestra un alert por ahora, puedes implementar un formulario)
  const handleEdit = (id) => {
    alert(`Modificar curso con ID: ${id}`);
    // Aquí podrías redirigir a un formulario de edición
  };

  return (
    <div>
      <h2>Cursos</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Grado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.id}</td>
              <td>{curso.nombre}</td>
              <td>{curso.grado}</td>
              <td>
                <button onClick={() => handleEdit(curso.id)}>Modificar</button>
                <button onClick={() => handleDelete(curso.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VerCursos;

