import React, { useState, useEffect } from 'react';
import directorService from '../../services/directorService';

function VerAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);

  // Obtener las asignaturas
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const asignaturasData = await directorService.obtenerAsignaturas();
        setAsignaturas(asignaturasData.asignaturas);
      } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
        // Manejar el error
      }
    };
    fetchAsignaturas();
  }, []);

  // Función para manejar la eliminación de una asignatura
  const handleDelete = async (id) => {
    try {
      await directorService.eliminarAsignatura(id);
      // Eliminar la asignatura de la lista local después de eliminarla en la base de datos
      setAsignaturas(asignaturas.filter((asignatura) => asignatura.id !== id));
      alert("Asignatura eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar la asignatura:", error);
      alert("Error al eliminar la asignatura.");
    }
  };

  // Función para manejar la modificación de una asignatura (esto solo muestra un alert por ahora, puedes implementar un formulario)
  const handleEdit = (id) => {
    alert(`Modificar asignatura con ID: ${id}`);
    // Aquí podrías redirigir a un formulario de edición
  };

  return (
    <div>
      <h2>Asignaturas</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.map((asignatura) => (
            <tr key={asignatura.id}>
              <td>{asignatura.id}</td>
              <td>{asignatura.nombre}</td> 
              <td>
                <button onClick={() => handleEdit(asignatura.id)}>Modificar</button>
                <button onClick={() => handleDelete(asignatura.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VerAsignaturas;
