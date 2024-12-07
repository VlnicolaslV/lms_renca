//LMS/lms_renca_frontend/src/services/profesorService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/profesor';

const authHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};
 
// Función para obtener todos los cursos asignatura del profesor 
export async function obtenerCursosProfesor() { 
	try { 
		const response = await axios.get(`${API_URL}/cursos/`, { headers: authHeader() }); 
		return response.data; 
	} catch (error) { 
	throw new Error(`Error al obtener los cursos del profesor: ${error.response ? error.response.data.error : error.message}`); 
	} 
}
 
// Función para obtener información de un curso asignatura
export async function obtenerCursoAsignatura(idCursoAsignatura) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el curso asignatura: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para obtener estudiantes de un curso asignatura
export async function obtenerEstudiantes(idCursoAsignatura) { 
  try { 
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/estudiantes/`, { headers: authHeader() }); 
    return response.data; 
  } catch (error) {
    throw new Error(`Error al obtener estudiantes: ${error.response ? error.response.data.error : error.message}`); 
  } 
}

// Función para obtener tareas de un curso asignatura
export async function obtenerTareas(idCursoAsignatura) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/tareas/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener las tareas: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para calificar una tarea
export async function calificarTarea(idTarea, idEstudiante, calificacion) {
  try {
    const response = await axios.post(`${API_URL}/tarea/${idTarea}/calificar/${idEstudiante}/`, { calificacion }, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al calificar la tarea: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para obtener calificaciones de una tarea
export async function obtenerCalificaciones(idTarea) {
  try {
    const response = await axios.get(`${API_URL}/tarea/${idTarea}/calificaciones/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener las calificaciones: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para crear un foro
export async function crearForo(idCursoAsignatura, datosForo) {
  try {
    const response = await axios.post(`${API_URL}/curso-asignatura/${idCursoAsignatura}/crear-foro/`, datosForo, { 
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear el foro: ${error.response ? error.response.data.error : error.message}`);
  }
}


// Función para obtener foros de un curso asignatura
export async function obtenerForos(idCursoAsignatura) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/foros/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener los foros: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para comentar en un foro
export async function comentarForo(idForo, comentario, fechaCreacion) {
  try {
    const response = await axios.post(`${API_URL}/curso-asignatura/${idForo}/comentar/`, { comentario, fecha_creacion: fechaCreacion }, { 
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al comentar en el foro: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para obtener comentarios de un foro
export async function obtenerComentarios(idForo) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idForo}/comentarios/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener los comentarios: ${error.response ? error.response.data.error : error.message}`);
  }
}



// Función para registrar asistencia
export async function tomarAsistencia(idCursoAsignatura, rutEstudiante, datosAsistencia) {
  try {
    const response = await axios.post(`${API_URL}/curso-asignatura/${idCursoAsignatura}/asistencia/${rutEstudiante}/`, datosAsistencia, {
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al tomar asistencia: ${error.response ? error.response.data.error : error.message}`);
  }
}


// Función para obtener asistencias de un curso asignatura
export async function obtenerAsistencias(idCursoAsignatura) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/asistencias/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener las asistencias: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para crear una tarea
export async function crearTarea(idCursoAsignatura, datosTarea) {
  try {
      const response = await axios.post(`${API_URL}/curso-asignatura/${idCursoAsignatura}/crear-tarea/`, datosTarea, {
          headers: { 
              ...authHeader(), 
              'Content-Type': 'multipart/form-data'  // Asegúrate de que el encabezado es multipart/form-data
          }
      });
      return response.data;
  } catch (error) {
      throw new Error(`Error al crear la tarea: ${error.response ? error.response.data.error : error.message}`);
  }
}

export async function subirRecurso(idCursoAsignatura, datosRecurso) {
  try {
    const response = await axios.post(`${API_URL}/curso-asignatura/${idCursoAsignatura}/subir-recurso/`, datosRecurso, { 
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al subir el recurso: ${error.response ? error.response.data.error : error.message}`);
  }
}

export async function obtenerRecursos(idCursoAsignatura) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/recursos/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener los recursos: ${error.response ? error.response.data.error : error.message}`);
  }
}


// Función para ver resultados de asistencia de un curso asignatura
export async function verResultadosAsistencia(idCursoAsignatura) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/resultados-asistencia/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener los resultados de asistencia: ${error.response ? error.response.data.error : error.message}`);
  }
}

// Función para ver resultados de calificaciones de un curso asignatura
export async function verResultadosCalificaciones(idCursoAsignatura) {
  try {
    const response = await axios.get(`${API_URL}/curso-asignatura/${idCursoAsignatura}/resultados-calificaciones/`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener los resultados de calificaciones: ${error.response ? error.response.data.error : error.message}`);
  }
}

const profesorService = {
  obtenerCursosProfesor,
  obtenerCursoAsignatura,
  obtenerEstudiantes,
  crearTarea,
  obtenerTareas,
  calificarTarea,
  obtenerCalificaciones,
  crearForo,
  obtenerForos,
  comentarForo,
  obtenerComentarios,
  tomarAsistencia,
  obtenerAsistencias,
  subirRecurso,
  obtenerRecursos,
  verResultadosAsistencia,
  verResultadosCalificaciones
};

export default profesorService;
