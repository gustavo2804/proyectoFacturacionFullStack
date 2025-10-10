import { useState, useEffect } from 'react';
import ClientesApi from '../services/clientes.api';
import { TipoComprobantesApi } from '../services/comprobantes.api';

/**
 * Hook personalizado para manejar el formulario de cliente
 */
export const useClienteForm = (id, isEditMode) => {
  const [cliente, setCliente] = useState({
    nombre: '',
    tipo_documento: '',
    numero_documento: '',
    tipo_ncf: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Cargar tipos de comprobante siempre
        const tiposData = await TipoComprobantesApi.getAll();
        setTiposComprobante(tiposData);
        
        // Cargar cliente solo si estamos en modo edición
        if (isEditMode) {
          const clienteData = await ClientesApi.getById(id);
          setCliente(clienteData);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleInputChange = (name, value) => {
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const reloadCliente = async () => {
    if (isEditMode) {
      try {
        setError(null);
        const data = await ClientesApi.getById(id);
        setCliente(data);
      } catch (error) {
        console.error('Error al recargar datos:', error);
        setError('Error al cancelar la edición');
        throw error;
      }
    }
  };

  return {
    cliente,
    setCliente,
    tiposComprobante,
    isLoading,
    error,
    setError,
    handleInputChange,
    reloadCliente
  };
};

