import React, { useState, useEffect } from 'react';
import directorService from '../../services/directorService';

function CrearCursoForm() {
  const [nombre, setNombre] = useState('');
  const [grado, setGrado] = useState('');
  const [colegio, setColegio] = useState(null); // Estado para el colegio del director

  // Obtener el colegio del director al cargar el componente
  useEffect(() => {
    const fetchColegio = async () => {
      try {
        const response = await directorService.obtenerColegioDirector(); // Llamada a la API
        setColegio(response);
      } catch (error) {
        console.error("Error al obtener el colegio del director:", error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    };
    fetchColegio();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await directorService.crearCurso({ 
        nombre, 
        grado, 
        colegio: colegio.id 
      });
      setNombre('');
      setGrado('');
      alert("Curso creado con éxito");
    } catch (error) {
      console.error("Error al crear el curso:", error);
      // Mostrar mensaje de error al usuario
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
        <label htmlFor="grado">Grado:</label>
        <input
          type="text"
          id="grado"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="colegio">Colegio:</label>
        <input 
          type="text" 
          id="colegio" 
          value={colegio ? colegio.nombre : "Cargando..."} // Mostrar nombre del colegio o "Cargando..."
          disabled 
        />
      </div>

      <button type="submit">Crear Curso</button>
    </form>
  );
}

export default CrearCursoForm;