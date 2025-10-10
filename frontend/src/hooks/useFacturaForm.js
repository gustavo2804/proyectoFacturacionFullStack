import { useState, useEffect } from 'react';
import FacturasApi from '@/services/facturas.api';
import ClientesApi from '@/services/clientes.api';
import { ProductosApi } from '@/services/facturas.api';
import { TipoComprobantesApi } from '@/services/comprobantes.api';
import { esEstadoEditable } from '@/config/facturaConfig';

/**
 * Hook personalizado para manejar el formulario de factura
 */
export const useFacturaForm = (id, isEditMode) => {
  const [factura, setFactura] = useState({
    numero_factura: '',
    cliente: '',
    tipo_comprobante: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    estado: 'Borrador',
    total: 0,
    ncf_asignado: null
  });

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFacturaEditable, setIsFacturaEditable] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar clientes, productos y tipos de comprobante en paralelo
        const [clientesData, productosData, tiposComprobanteData] = await Promise.all([
          ClientesApi.getAll(),
          ProductosApi.getAll(),
          TipoComprobantesApi.getAll()
        ]);

        console.log('FacturasDetails - Clientes cargados:', clientesData.length);
        console.log('FacturasDetails - Productos cargados:', productosData.length);
        console.log('FacturasDetails - Tipos de comprobante cargados:', tiposComprobanteData.length);
        
        setClientes(clientesData);
        setProductos(productosData);
        setTiposComprobante(tiposComprobanteData);

        // Si es modo edición, cargar factura
        if (isEditMode) {
          console.log('Cargando factura con ID:', id);
          const facturaData = await FacturasApi.getById(id);
          
          console.log('Factura cargada:', facturaData);
          
          // Determinar si la factura es editable
          const facturaEditable = esEstadoEditable(facturaData.estado);
          setIsFacturaEditable(facturaEditable);
          
          setFactura({
            ...facturaData,
            cliente: facturaData.cliente?.id || facturaData.cliente || '',
            tipo_comprobante: facturaData.tipo_comprobante?.id || facturaData.tipo_comprobante || '',
            fecha_emision: facturaData.fecha_emision,
            fecha_vencimiento: facturaData.fecha_vencimiento || '',
            ncf_asignado: facturaData.ncf_asignado || null
          });
        } else {
          // Para nuevas facturas, el número se generará automáticamente
          setFactura(prev => ({
            ...prev,
            numero_factura: 'Auto-generado'
          }));
          setIsFacturaEditable(true);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleFacturaChange = (field, value) => {
    setFactura(prev => ({
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
    factura,
    setFactura,
    clientes,
    productos,
    tiposComprobante,
    isLoading,
    error,
    setError,
    isFacturaEditable,
    handleFacturaChange,
    handleClienteCreated,
    handleArticuloCreated
  };
};

