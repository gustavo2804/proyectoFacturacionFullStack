/**
 * Utilidades para manejo de autenticación
 */

// Variable global para almacenar la función de logout
let logoutCallback = null;

/**
 * Registra la función de logout desde el AuthContext
 */
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

/**
 * Ejecuta el logout cuando la sesión expira
 */
export const handleSessionExpired = () => {
  console.log('Sesión expirada. Cerrando sesión...');
  
  // Limpiar localStorage
  localStorage.removeItem('user');
  
  // Ejecutar logout si existe el callback
  if (logoutCallback) {
    logoutCallback(false); // false = no redirigir, lo haremos manualmente
  }
  
  // Redirigir al login
  const currentPath = window.location.pathname;
  if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
    window.location.href = '/login';
  }
};

