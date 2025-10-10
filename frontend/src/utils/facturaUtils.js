/**
 * Utilidades para el manejo de facturas
 */

/**
 * Calcula los totales de una factura
 */
export const calcularTotales = (detalles, itbisRate) => {
  const subtotal = detalles.reduce((sum, detalle) => {
    const detalleSubtotal = parseFloat(detalle.subtotal) || 0;
    return sum + detalleSubtotal;
  }, 0);
  
  const itbis = subtotal * itbisRate;
  const total = subtotal + itbis;

  return {
    subtotal: subtotal.toFixed(2),
    itbis: itbis.toFixed(2),
    total: total.toFixed(2),
    itbisPercentage: (itbisRate * 100).toFixed(0)
  };
};

/**
 * Prepara los datos de la factura para enviar al backend
 */
export const prepararFacturaData = (factura, detalles, totales, isEditMode) => {
  const detalle_facturas = detalles.map(detalle => ({
    producto: parseInt(detalle.producto) || detalle.producto,
    descripcion: detalle.descripcion || '',
    cantidad: detalle.cantidad,
    precio_unitario: detalle.precio_unitario,
    subtotal: detalle.subtotal
  }));

  const facturaData = {
    ...factura,
    cliente: parseInt(factura.cliente) || factura.cliente,
    tipo_comprobante: parseInt(factura.tipo_comprobante) || factura.tipo_comprobante,
    total: parseFloat(totales.total),
    detalle_facturas: detalle_facturas
  };

  // Para nuevas facturas, no enviar el número (se genera automáticamente)
  if (!isEditMode) {
    delete facturaData.numero_factura;
  }

  return facturaData;
};

/**
 * Valida los datos antes de generar el PDF
 */
export const validarDatosParaPDF = (factura, detalles, clientes) => {
  const clienteSeleccionado = clientes.find(c => c.id === parseInt(factura.cliente));
  
  if (!clienteSeleccionado) {
    throw new Error('Debe seleccionar un cliente para generar el PDF');
  }

  if (detalles.length === 0) {
    throw new Error('Debe agregar al menos un producto para generar el PDF');
  }

  return clienteSeleccionado;
};

