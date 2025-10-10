import { useState, useEffect } from 'react';
import CotizacionesApi, { DetalleCotizacionApi } from '../services/cotizaciones.api';
import ClientesApi from '../services/clientes.api';
import { ProductosApi } from '../services/facturas.api';

/**
 * Hook personalizado para manejar el formulario de cotización
 */
export const useCotizacionForm = (id, isEditMode) => {
  const [cotizacion, setCotizacion] = useState({
    numero_cotizacion: '',
    cliente: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    anulado: false,
    total: 0
  });

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar clientes y productos en paralelo
        const [clientesData, productosData] = await Promise.all([
          ClientesApi.getAll(),
          ProductosApi.getAll()
        ]);
        
        setClientes(clientesData);
        setProductos(productosData);

        // Si es modo edición, cargar cotización
        if (isEditMode) {
          const cotizacionData = await CotizacionesApi.getById(id);
          
          setCotizacion({
            ...cotizacionData,
            fecha_emision: cotizacionData.fecha_emision,
            fecha_vencimiento: cotizacionData.fecha_vencimiento || ''
          });
        } else {
          // Para nuevas cotizaciones, el número se generará automáticamente
          setCotizacion(prev => ({
            ...prev,
            numero_cotizacion: 'Auto-generado'
          }));
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

  const handleCotizacionChange = (field, value) => {
    setCotizacion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClienteCreated = (newCliente) => {
    setClientes(prev => [...prev, newCliente]);
  };

  const handleArticuloCreated = (newArticulo) => {
    setProductos(prev => [...prev, newArticulo]);
  };

  return {
    cotizacion,
    setCotizacion,
    clientes,
    productos,
    isLoading,
    error,
    setError,
    handleCotizacionChange,
    handleClienteCreated,
    handleArticuloCreated
  };
};

