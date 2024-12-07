import React, { useState, useEffect } from 'react';
import directorService from '../../services/directorService';

function VerEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);

  // Obtener los estudiantes
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const estudiantesData = await directorService.obtenerEstudiantes();
        setEstudiantes(estudiantesData.estudiantes);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        // Manejar el error
      }
    };
    fetchEstudiantes();
  }, []);

  // Función para manejar la eliminación de un estudiante
  const handleDelete = async (rut) => {
    try {
      await directorService.eliminarEstudiante(rut);
      // Eliminar el estudiante de la lista local después de eliminarlo en la base de datos
      setEstudiantes(estudiantes.filter((estudiante) => estudiante.rut !== rut));
      alert("Estudiante eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el estudiante:", error);
      alert("Error al eliminar el estudiante.");
    }
  };

  // Función para manejar la modificación de un estudiante (esto solo muestra un alert por ahora, puedes implementar un formulario)
  const handleEdit = (rut) => {
    alert(`Modificar estudiante con RUT: ${rut}`);
    // Aquí podrías redirigir a un formulario de edición
  };

  return (
    <div>
      <h2>Estudiantes</h2>
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
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.rut}>
              <td>{estudiante.rut}</td>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.apellido}</td>
              <td>{estudiante.direccion}</td>
              <td>{estudiante.telefono}</td>
              <td>{estudiante.correo}</td>
              <td>{estudiante.fecha_nacimiento}</td>
              <td>
                <button onClick={() => handleEdit(estudiante.rut)}>Modificar</button>
                <button onClick={() => handleDelete(estudiante.rut)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VerEstudiantes;
