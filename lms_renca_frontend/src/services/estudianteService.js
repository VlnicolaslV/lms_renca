//LMS/lms_renca/src/components/estudianteService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/estudiante/';

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

export const EstudianteService = {
    //funcion que obtiene las asignaturas y cursos de un estudiante
    obtener_cursos_y_asignaturas: async () => { 
        try { 
            const response = await axios.get(`${API_BASE_URL}cursos-y-asignaturas/`, { headers: authHeader() }); 
            return response.data; 
        } catch (error) { 
            console.error("Error al obtener cursos y asignaturas:", error); 
            throw error; 
        } 
    },
    //funcion que obtiene las calificaciones del estudiante logeado
    obtener_calificaciones: async (estudianteRut) => {
        try {
            const response = await axios.get(`${API_BASE_URL}calificaciones/${estudianteRut}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener calificaciones:", error);
            throw error;
        }
    },
    //funcion que obtiene la asistencia del estudiante logeado
    obtener_asistencia: async (estudianteRut) => {
        try {
            const response = await axios.get(`${API_BASE_URL}asistencias/${estudianteRut}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener asistencia:", error);
            throw error;
        }
    },
    obtener_recursos: async (asignaturaId) => { 
        try { 
            const response = await axios.get(`${API_BASE_URL}recursos-asignatura/${asignaturaId}/`, { 
                headers: authHeader() 
            }
        ); 
            return response.data; 
        } catch (error) { 
            console.error("Error al obtener recursos:", error); 
            throw error; 
        } 
    }, 
    
    descargar_recurso: async (recursoId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}recursos/${recursoId}/`, { headers: authHeader(), responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1]);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return response.data;
        } catch (error) {
            console.error("Error al descargar recurso:", error);
            throw error;
        }
    },
    
    //funcion que obtiene los foros asociados a las asignaturas que tiene el curso en el cual esta inscrito el estudiante
    obtener_foros: async (asignaturaId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}foros-asignatura/${asignaturaId}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener foros:", error);
            throw error;
        }
    },
    obtener_comentarios: async (foroId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}foro/${foroId}/comentarios/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener comentarios del foro:", error);
            throw error;
        }
    },
    participar_foro: async (foroId, mensaje) => {
        try {
            const response = await axios.post(`${API_BASE_URL}foro/${foroId}/participar/`, { mensaje}, 
                { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al participar en foro:", error);
            throw error;
        }
    },
    comentar_foro: async (foroId, comentario, fechaCreacionComentario) => {
         try {
             const response = await axios.post(`${API_BASE_URL}foro/${foroId}/comentar/`, { comentario, fecha_creacion: fechaCreacionComentario }, 
                { headers: authHeader() }); 
                return response.data; 
            } catch (error) { 
                console.error("Error al comentar en foro:", error); 
                throw error; 
            } 
        },

    //Obtiene las notas del estudiante que esta logeado en el sistema y las agrupa por asignatura.
    obtener_notas: async (estudianteRut) => {
        try {
            
            const response = await axios.get(`${API_BASE_URL}notas/<str:estudiante_rut>/${estudianteRut}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener notas:", error);
            throw error;
        }
    },
 


    //Obtiene los promedios de un estudiante con filtro por asignatura y semestre
    obtener_promedios: async (estudianteRut, asignaturaId, semestre) => {
        try {
            const response = await axios.get(`${API_BASE_URL}promedios/${estudianteRut}/${asignaturaId}/${semestre}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener promedios:", error);
            throw error;
        }
    },
    //    """Obtiene las tareas del estudiante asociados al curso en el cual esta inscrito."""
    obtener_tareas: async (estudianteRut) => {
        try {
            if (!estudianteRut) {
                throw new Error("El rut del estudiante es undefined");
            }
            const response = await axios.get(`${API_BASE_URL}tareas/${estudianteRut}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener tareas:", error);
            throw error;
        }
    },

    subir_respuesta: async (formData) => { 
        try { 
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}subir-respuesta/`, formData, { 
                headers: 
                { 
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': `Bearer ${token}`
                } 
            }); 
            return response.data; 
        } catch (error) { 
            console.error('Error al subir la respuesta:', error); 
            throw error; 
        } 
    },

    obtener_respuestas: async (estudianteRut) => {
         try { 
            const response = await axios.get(`${API_BASE_URL}respuestas/${estudianteRut}`, { headers: authHeader() }); 
            return response.data; 
        } catch (error) { 
            console.error('Error al obtener las respuestas:', error); 
            throw error; 
        } 
    },
    
    
    
    //    """Obtiene el porcentaje de asistencia del estudiante logeado en el sistema y lo agrupamos por asignatura"""
    obtener_porcentaje_asistencia: async (estudianteRut) => {
        try {
            const response = await axios.get(`${API_BASE_URL}asistencia/${estudianteRut}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener porcentaje de asistencia:", error);
            throw error;
        }
    },
    //"""Obtiene los reportes de progreso del estudiante."""
    obtener_reportes_progreso: async (estudianteRut) => {
        try {
            const response = await axios.get(`${API_BASE_URL}resultados${estudianteRut}/`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener reportes de progreso:", error);
            throw error;
        }
    },

};

export default EstudianteService;