import React, { useState, useEffect } from 'react';
import directorService from '../../services/directorService';

function VerProfesores() {
  const [profesores, setProfesores] = useState([]);

  // Obtener los profesores
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const profesoresData = await directorService.obtenerProfesores();
        setProfesores(profesoresData.profesores);  // Acceder a la propiedad 'profesores'
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
        // Manejar el error
      }
    };
    fetchProfesores();
  }, []);

  // Función para manejar la eliminación de un profesor
  const handleDelete = async (rut) => {
    try {
      await directorService.eliminarProfesor(rut);
      // Eliminar el profesor de la lista local después de eliminarlo en la base de datos
      setProfesores(profesores.filter((profesor) => profesor.rut !== rut));
      alert("Profesor eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el profesor:", error);
      alert("Error al eliminar el profesor.");
    }
  };

  // Función para manejar la modificación de un profesor (esto solo muestra un alert por ahora, puedes implementar un formulario)
  const handleEdit = (rut) => {
    alert(`Modificar profesor con RUT: ${rut}`);
    // Aquí podrías redirigir a un formulario de edición
  };

  return (
    <div>
      <h2>Profesores</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Fecha de Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor) => (
            <tr key={profesor.rut}>
              <td>{profesor.rut}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.apellido}</td>
              <td>{profesor.direccion}</td>
              <td>{profesor.telefono}</td>
              <td>{profesor.correo}</td>
              <td>{profesor.fecha_nacimiento}</td>
              <td>
                <button onClick={() => handleEdit(profesor.rut)}>Modificar</button>
                <button onClick={() => handleDelete(profesor.rut)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VerProfesores;
