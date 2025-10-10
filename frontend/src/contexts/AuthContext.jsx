import { createContext, useState, useContext, useEffect } from 'react';
import Authapi from '../services/auth';
import { setLogoutCallback } from '../utils/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Registrar la función de logout globalmente para el interceptor
  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Verificar si el token es válido (las cookies se envían automáticamente)
      const response = await Authapi.isAuthenticated();
      if (response.is_authenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        // No está autenticado
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await Authapi.login(credentials);
      
      if (response.success) {
        // El backend ya configuró las cookies, solo actualizamos el estado
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Error al iniciar sesión' 
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await Authapi.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al crear la cuenta' 
      };
    }
  };

  const logout = async (redirect = true) => {
    try {
      // El backend maneja las cookies automáticamente
      await Authapi.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      
      // Redirigir al login si se solicita
      if (redirect) {
        window.location.href = '/login';
      }
    }
  };

  const refreshToken = async () => {
    try {
      // El backend maneja las cookies automáticamente
      const response = await Authapi.refreshToken();
      
      if (response.refreshed) {
        // Verificar autenticación nuevamente
        const userResponse = await Authapi.isAuthenticated();
        setUser(userResponse.user);
        setIsAuthenticated(true);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error refrescando token:', error);
      logout();
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
