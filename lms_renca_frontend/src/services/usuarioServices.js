// LMS/lms_renca_frontend/src/services/usuarioServices.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/usuario/';

const login = async (rut, password) => {
  try {
    const response = await axios.post(API_URL + 'login/', {
      rut,
      password,
    });
    
    // Guardar el token de acceso en localStorage
    localStorage.setItem('token', response.data.access);
    return response.data;  // Devuelve la respuesta completa, que incluye el token, rol, y otros datos
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

const usuarioService = {
  login,
};

export default usuarioService;
