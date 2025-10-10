import { useState, useEffect } from 'react';
import ProductosApi from '../services/productos.api';

/**
 * Hook personalizado para manejar el formulario de producto
 */
export const useProductoForm = (id, isEditMode) => {
  const [producto, setProducto] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (isEditMode) {
          const data = await ProductosApi.getById(id);
          setProducto(data);
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setError('Error al cargar los datos del producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducto();
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setProducto(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    producto,
    isLoading,
    error,
    setError,
    handleInputChange
  };
};

