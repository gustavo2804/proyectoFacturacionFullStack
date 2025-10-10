import { useState, useEffect } from 'react';
import { SerieComprobantesApi, TipoComprobantesApi } from '../services/comprobantes.api';

/**
 * Hook personalizado para manejar el formulario de serie comprobante
 */
export const useComprobanteForm = (id, isEditMode) => {
  const [serieComprobante, setSerieComprobante] = useState({
    tipo_comprobante: '',
    desde: 1,
    hasta: 100,
    numero_actual: 1,
    fecha_vencimiento: '',
    tiene_comprobantes_generados: false,
    anulado: false
  });

  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar tipos de comprobante
        const tiposData = await TipoComprobantesApi.getAll();
        
        console.log('Tipos de comprobante cargados:', tiposData);
        
        setTiposComprobante(tiposData);

        // Si es modo edición, cargar serie comprobante
        if (isEditMode) {
          const serieData = await SerieComprobantesApi.getById(id);
          setSerieComprobante({
            ...serieData,
            fecha_vencimiento: serieData.fecha_vencimiento || '',
            tiene_comprobantes_generados: serieData.tiene_comprobantes_generados || false,
            anulado: serieData.anulado || false
          });
        } else {
          // Generar número actual automático basado en el rango desde-hasta
          const series = await SerieComprobantesApi.getAll();
          const numeros = series
            .map(s => parseInt(s.numero_actual) || 0)
            .filter(num => !isNaN(num));
          const ultimoNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
          setSerieComprobante(prev => ({
            ...prev,
            numero_actual: ultimoNumero + 1
          }));
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        let errorMessage = 'Error al cargar los datos';
        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${error.response.data?.detail || error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'Error de conexión. Verifica que el servidor esté disponible.';
        } else {
          errorMessage = error.message || 'Error desconocido';
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setSerieComprobante(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    serieComprobante,
    tiposComprobante,
    isLoading,
    error,
    setError,
    handleInputChange
  };
};

