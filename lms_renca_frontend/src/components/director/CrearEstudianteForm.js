import React, { useState, useEffect } from 'react';
import directorService from '../../services/directorService';

function CrearEstudianteForm() {
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [cursos, setCursos] = useState([]);

  // Cargar los cursos disponibles cuando se monta el componente
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosData = await directorService.obtenerCursos();
        setCursos(cursosData.cursos);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Crear el estudiante, el rol será 'ESTUDIANTE' automáticamente
      await directorService.crearEstudiante({
        rut,
        nombre,
        apellido,
        direccion,
        telefono,
        correo,
        fecha_nacimiento: fechaNacimiento,
        password,
        rol: 'ESTUDIANTE', // Asignamos el rol de forma automática
        curso_id: cursoId,
      });

      // Limpiar el formulario después de enviar
      setRut('');
      setNombre('');
      setApellido('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setFechaNacimiento('');
      setPassword('');
      setCursoId('');

      alert('Estudiante creado con éxito');
    } catch (error) {
      console.error('Error al crear el estudiante:', error);
      // Mostrar un mensaje de error si algo sale mal
      alert('Error al crear el estudiante');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="rut">Rut:</label>
        <input
          type="text"
          id="rut"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="direccion">Dirección:</label>
        <input
          type="text"
          id="direccion"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="telefono">Teléfono:</label>
        <input
          type="text"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
        <input
          type="date"
          id="fechaNacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <button type="submit">Crear Estudiante</button>
    </form>
  );
}

export default CrearEstudianteForm;
