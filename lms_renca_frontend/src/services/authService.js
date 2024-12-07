import axios from 'axios';

const API_URL = 'http://localhost:8000/api/usuario/';

const login = async (rut, password) => {
  try {
    const response = await axios.post(API_URL + 'token/', {
      rut,
      password,
    });

    // Verifica y guarda los tokens
    if (response.data.access && response.data.refresh) {
      console.log("Tokens recibidos:", response.data);
      localStorage.setItem('token', response.data.access);
      document.cookie = `refresh=${response.data.refresh}; path=/; SameSite=Lax; Secure`;

      // Verificar las cookies después de guardarlas
      console.log("Cookies después de login:", document.cookie);
    } else {
      console.error("Falta el token de acceso o de actualización.");
    }

    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

const getUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se ha encontrado un token de acceso');
    }
    
    const response = await axios.get(API_URL + 'profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  document.cookie = 'refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure';
}


const authService = {
  login,
  getUserData,
  cerrarSesion,
};

export default authService;
