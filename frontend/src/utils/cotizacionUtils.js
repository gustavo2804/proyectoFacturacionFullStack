/**
 * Utilidades para el manejo de cotizaciones
 */

/**
 * Calcula los totales de una cotización
 */
export const calcularTotales = (detalles, itbisRate) => {
  const subtotal = detalles.reduce((sum, detalle) => {
    const detalleSubtotal = parseFloat(detalle.subtotal) || 0;
    return sum + detalleSubtotal;
  }, 0);
  
  const itbis = subtotal * (parseFloat(itbisRate) || 0);
  const total = subtotal + itbis;

  return {
    subtotal: subtotal.toFixed(2),
    itbis: itbis.toFixed(2),
    total: total.toFixed(2),
    itbisPercentage: ((parseFloat(itbisRate) || 0) * 100).toFixed(0)
  };
};

/**
 * Prepara los datos de la cotización para enviar al backend
 */
export const prepararCotizacionData = (cotizacion, detalles, totales, isEditMode) => {
  const detalle_cotizaciones = detalles.map(detalle => ({
    producto: parseInt(detalle.producto),
    descripcion: detalle.descripcion || '',
    cantidad: detalle.cantidad,
    precio_unitario: detalle.precio_unitario,
    subtotal: detalle.subtotal
  }));

  const cotizacionData = {
    ...cotizacion,
    total: parseFloat(totales.total),
    detalle_cotizaciones: detalle_cotizaciones
  };

  // Para nuevas cotizaciones, no enviar el número (se genera automáticamente)
  if (!isEditMode) {
    delete cotizacionData.numero_cotizacion;
  }

  return cotizacionData;
};

/**
 * Valida los datos antes de generar el PDF
 */
export const validarDatosParaPDF = (cotizacion, detalles, clientes) => {
  const clienteSeleccionado = clientes.find(c => c.id === parseInt(cotizacion.cliente));
  
  if (!clienteSeleccionado) {
    throw new Error('Debe seleccionar un cliente para generar el PDF');
  }

  if (detalles.length === 0) {
    throw new Error('Debe agregar al menos un producto para generar el PDF');
  }

  return clienteSeleccionado;
};

