import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/municipalidad/';

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

export const AdministradorService = {
    // Función para crear un colegio 
    crearColegio: async (data) => { 
        try { 
            const response = await axios.post(`${API_BASE_URL}colegios/`, data, { headers: authHeader() }); 
            return response.data; 
        } catch (error) { 
            console.error("Error al crear colegio:", error); 
            throw error; 
        } 
    },
    // Función para crear un director
    crearDirector: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}directores/`, data, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al crear director:", error);
            throw error;
        }
    },
    // Función para obtener municipalidades
    obtenerMunicipalidades: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}municipalidades/`, { headers: authHeader() });
            return response.data.municipalidades;
        } catch (error) {
            console.error("Error al obtener municipalidades:", error);
            throw error;
        }
    }, 
    // Función para obtener colegios 
    obtenerColegios: async () => { 
        try { 
            const response = await axios.get(`${API_BASE_URL}colegios/listar/`, { headers: authHeader() }); 
            return response.data; 
        } catch (error) { 
            console.error("Error al obtener colegios:", error); 
            throw error; 
        } 
    },
    // Función para obtener directores
    obtenerDirectores: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}directores/listar/`, { headers: authHeader() });
            return response.data.directores;
        } catch (error) {
            console.error("Error al obtener directores:", error);
            throw error;
        }
    },
    // Funcion para obtener los directores sin colegio asociado
    obtenerDirectoresSinColegio: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}directores/sin-colegio/`, { headers: authHeader() });
            return response.data.directores;
        } catch (error) {
            console.error("Error al obtener directores sin colegio:", error);
            throw error;
        }
    },
    // Función para obtener cursos
    obtenerCursos: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}cursos/`, { headers: authHeader() });
            return response.data.cursos;
        } catch (error) {
            console.error("Error al obtener cursos:", error);
            throw error;
        }
    },
    // Función para obtener asignaturas
    obtenerAsignaturas: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}asignaturas/`, { headers: authHeader() });
            return response.data.asignaturas;
        } catch (error) {
            console.error("Error al obtener asignaturas:", error);
            throw error;
        }
    },
    // Función para obtener inscripciones
    obtenerInscripciones: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}inscripciones/`, { headers: authHeader() });
            return response.data.inscripciones;
        } catch (error) {
            console.error("Error al obtener inscripciones:", error);
            throw error;
        }
    },
    // Función para eliminar colegio
    eliminarColegio: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}colegios/eliminar/${id}/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al eliminar colegio:", error);
            throw error;
        }
    },
    // Función para obtener resultados
    obtenerResultados: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}resultados/`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Error al obtener resultados:", error);
            throw error;
        }
    },
};

export default AdministradorService;
