import { useState, useEffect } from 'react';
import { ComprobantesApi } from '@/services/comprobantes.api';

/**
 * Hook personalizado para manejar la lógica de NCF (Número de Comprobante Fiscal)
 */
export const useNCFManagement = (tipoComprobanteId, estado, ncfAsignado) => {
  const [ncfDisponible, setNcfDisponible] = useState(null);
  const [isLoadingNCF, setIsLoadingNCF] = useState(false);

  useEffect(() => {
    // Solo buscar NCF si el estado es 'Activa' y no hay NCF asignado
    if (estado === 'Activa' && !ncfAsignado && tipoComprobanteId) {
      buscarNCFDisponible(tipoComprobanteId);
    } else {
      setNcfDisponible(null);
    }
  }, [tipoComprobanteId, estado, ncfAsignado]);

  const buscarNCFDisponible = async (tipoId) => {
    if (!tipoId) {
      setNcfDisponible(null);
      return;
    }

    try {
      setIsLoadingNCF(true);
      const data = await ComprobantesApi.getDisponibles(tipoId);
      if (data.length > 0) {
        setNcfDisponible(data[0]); // Tomar el primer NCF disponible
      } else {
        setNcfDisponible(null);
      }
    } catch (error) {
      console.error('Error al buscar NCF disponible:', error);
      setNcfDisponible(null);
    } finally {
      setIsLoadingNCF(false);
    }
  };

  return {
    ncfDisponible,
    isLoadingNCF,
    buscarNCFDisponible
  };
};

