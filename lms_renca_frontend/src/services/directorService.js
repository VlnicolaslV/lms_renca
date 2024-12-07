//LMS/lms_renca_frontend/src/services/directorService.js
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const API_URL = 'http://localhost:8000/api/director/';

const authHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
      return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const obtenerColegioDirector = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha encontrado un token de acceso');
    }

    const response = await axios.get(API_URL + 'obtener_colegio_director/', { // Ajusta la URL según tu API
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener el colegio del director:", error);
    throw error; // Re-lanzar el error para manejarlo en el componente
  }
};

const crearCurso = async (cursoData) => {
  try {
    const response = await axios.post(API_URL + 'crear_curso/', cursoData, { headers: authHeader() });
    return response.data;
  } catch (error) {
    console.error("Error al crear el curso:", error);
    throw error;
  }
};

const crearProfesor = async (profesorData) => {
  try {
    const response = await axios.post(API_URL + 'crear_profesor/', profesorData, { headers: authHeader() });
    return response.data;
  } catch (error) {
    console.error("Error al crear el profesor:", error);
    throw error;
  }
};

const crearEstudiante = async (estudianteData) => {
  try {
    const response = await axios.post(API_URL + 'crear_estudiante/', estudianteData, { headers: authHeader() });
    return response.data;
  } catch (error) {
    console.error("Error al crear el estudiante:", error);
    throw error;
  }
};

const crearAsignatura = async (asignaturaData) => {
  try {
    const response = await axios.post(API_URL + 'crear_asignatura/', asignaturaData, { headers: authHeader() });
    return response.data;
  } catch (error) {
    console.error("Error al crear la asignatura:", error);
    throw error;
  }
};

const todosProfesores = async () => {
  try {
    const toke = localStorage.getItem('token');
    if (!toke) {
      throw new Error('No se ha encontrado un token de acceso');
    }

    const response = await axios.get(API_URL + 'todos_profesores1/', {
      headers: {
        Authorization: `Bearer ${toke}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los profesores:", error);
    throw error;
  }
};



const obtenerCursos = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha encontrado un token de acceso');
    }

    console.log("Token en la solicitud:", token); // Imprimir el token

    const response = await axios.get(API_URL + 'cursos/', {
      headers: {
        Authorization: `Bearer ${token}` // Asegurar el formato correcto
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    throw error;
  }
};


const obtenerProfesores = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha encontrado un token de acceso');
    }

    console.log("Token en la solicitud:", token); // Imprimir el token

    const response = await axios.get(API_URL + 'profesores/', {
      headers: {
        Authorization: `Bearer ${token}` // Asegurar el formato correcto
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los profesores:", error);
    throw error;
  }
};

const obtenerEstudiantes = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha encontrado un token de acceso');
    }

    console.log("Token en la solicitud:", token); // Imprimir el token

    const response = await axios.get(API_URL + 'estudiantes/', {
      headers: {
        Authorization: `Bearer ${token}` // Asegurar el formato correcto
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    throw error;
  }
};

const obtenerAsignaturas = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha encontrado un token de acceso');
    }

    console.log("Token en la solicitud:", token); // Imprimir el token

    const response = await axios.get(API_URL + 'asignaturas/', {
      headers: {
        Authorization: `Bearer ${token}` // Asegurar el formato correcto
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los asignaturas:", error);
    throw error;
  }
};

const obtenerReporteAsistencia = async () => {
  try {
    const response = await axios.get(API_URL + 'reporte_asistencia/');
    return response;
  } catch (error) {
    console.error("Error al obtener el reporte de asistencia:", error);
    // Mostrar un mensaje de error al usuario (similar al manejo de errores en crearCurso)
    return null;
  }
};

const obtenerReporteCalificaciones = async () => {
  try {
    const response = await axios.get(API_URL + 'reporte_calificaciones/');
    return response;
  } catch (error) {
    console.error("Error al obtener el reporte de calificaciones:", error);
    // Mostrar un mensaje de error al usuario (similar al manejo de errores en crearCurso)
    return null;
  }
};



const directorService = {
  crearCurso,
  crearProfesor,
  crearEstudiante,
  crearAsignatura,
  obtenerCursos,
  obtenerProfesores,
  obtenerEstudiantes,
  obtenerAsignaturas,
  obtenerReporteAsistencia,
  obtenerReporteCalificaciones,
  obtenerColegioDirector,
  todosProfesores
};

export default directorService;
