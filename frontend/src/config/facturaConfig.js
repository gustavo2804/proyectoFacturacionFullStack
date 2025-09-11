// Configuración de estados de factura
export const ESTADOS_FACTURA = [
  { value: 'Borrador', label: 'Borrador', editable: true },
  { value: 'Pendiente', label: 'Pendiente', editable: true },
  { value: 'Activa', label: 'Activa', editable: false },
  { value: 'Pagada', label: 'Pagada', editable: false },
  { value: 'Anulada', label: 'Anulada', editable: false }
];

// Estados que permiten edición
export const ESTADOS_EDITABLES = ESTADOS_FACTURA.filter(estado => estado.editable);

// Estados que no permiten edición
export const ESTADOS_NO_EDITABLES = ESTADOS_FACTURA.filter(estado => !estado.editable);

// Función para verificar si un estado permite edición
export const esEstadoEditable = (estado) => {
  return ESTADOS_FACTURA.find(e => e.value === estado)?.editable || false;
};
