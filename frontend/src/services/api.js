import axios from 'axios'
import { handleSessionExpired } from '../utils/authUtils'

const api = axios.create({
    baseURL: "http://localhost:8000/api", // tu backend de Django
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

// Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    // Si hay un error de autenticación (401 Unauthorized o 403 Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Verificar si no estamos ya en la página de login para evitar loops
      const currentPath = window.location.pathname;
      
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        // Manejar la expiración de sesión
        handleSessionExpired();
      }
    }
    
    // Rechazar la promesa para que el error pueda ser manejado por el código que hizo la petición
    return Promise.reject(error);
  }
);


  export default api;