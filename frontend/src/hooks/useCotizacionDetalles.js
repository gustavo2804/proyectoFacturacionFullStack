import { useState, useEffect } from 'react';
import { DetalleCotizacionApi } from '../services/cotizaciones.api';

/**
 * Hook personalizado para manejar los detalles de la cotización
 */
export const useCotizacionDetalles = (id, isEditMode) => {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    if (isEditMode && id) {
      loadDetalles();
    }
  }, [id, isEditMode]);

  const loadDetalles = async () => {
    try {
      const detallesData = await DetalleCotizacionApi.getByCotizacionId(id);
      const detallesConSubtotalValido = detallesData.map(detalle => ({
        ...detalle,
        descripcion: detalle.descripcion || '',
        cantidad: parseFloat(detalle.cantidad) || 0,
        precio_unitario: parseFloat(detalle.precio_unitario) || 0,
        subtotal: parseFloat(detalle.subtotal) || 0
      }));
      setDetalles(detallesConSubtotalValido);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      throw error;
    }
  };

  const handleAddDetalle = () => {
    const nuevoDetalle = {
      id: Date.now(), // ID temporal
      producto: '',
      descripcion: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0
    };
    setDetalles(prev => [...prev, nuevoDetalle]);
  };

  const handleDetalleChange = (index, field, value) => {
    setDetalles(prev => {
      const nuevosDetalles = [...prev];
      nuevosDetalles[index] = {
        ...nuevosDetalles[index],
        [field]: value
      };

      // Calcular subtotal cuando cambia cantidad o precio
      if (field === 'cantidad' || field === 'precio_unitario') {
        const cantidad = field === 'cantidad' ? parseFloat(value) || 0 : parseFloat(nuevosDetalles[index].cantidad) || 0;
        const precio = field === 'precio_unitario' ? parseFloat(value) || 0 : parseFloat(nuevosDetalles[index].precio_unitario) || 0;
        nuevosDetalles[index].subtotal = cantidad * precio;
      }

      return nuevosDetalles;
    });
  };

  const handleRemoveDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductoChange = (index, productoId, productos) => {
    const producto = productos.find(p => p.id === parseInt(productoId));
    if (producto) {
      handleDetalleChange(index, 'producto', productoId);
      handleDetalleChange(index, 'precio_unitario', producto.precio || 0);
    }
  };

  return {
    detalles,
    setDetalles,
    handleAddDetalle,
    handleDetalleChange,
    handleRemoveDetalle,
    handleProductoChange,
    loadDetalles
  };
};

