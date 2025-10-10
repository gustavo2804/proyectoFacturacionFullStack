/**
 * Componente para mostrar alertas relacionadas con la factura
 */
const FacturaAlerts = ({ 
  factura, 
  isEditMode, 
  isFacturaEditable, 
  ncfDisponible 
}) => {
  return (
    <>
      {/* Info message cuando la factura no es editable */}
      {!isFacturaEditable && isEditMode && (
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg text-blue-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Factura en estado "{factura.estado}"</span>
          </div>
          <p className="text-sm mt-1">
            Esta factura ya fue guardada en un estado final y no puede ser modificada. Solo se puede visualizar y generar PDF.
          </p>
        </div>
      )}

      {/* Info message cuando se va a activar la factura */}
      {factura.estado === 'Activa' && !factura.ncf_asignado && isFacturaEditable && (
        <div className={`p-4 border rounded-lg ${
          ncfDisponible 
            ? 'border-green-200 bg-green-50 text-green-700' 
            : factura.tipo_comprobante 
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-orange-200 bg-orange-50 text-orange-700'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              ncfDisponible 
                ? 'bg-green-500' 
                : factura.tipo_comprobante 
                  ? 'bg-red-500'
                  : 'bg-orange-500'
            }`}></div>
            <span className="font-medium">Factura en estado "Activa"</span>
          </div>
          <p className="text-sm mt-1">
            {ncfDisponible 
              ? `Al guardar esta factura, se asignará automáticamente el NCF: ${ncfDisponible.numero_comprobante_completo} (${ncfDisponible.tipo_comprobante?.tipo_comprobante || 'N/A'})`
              : factura.tipo_comprobante 
                ? 'No hay NCF disponibles para el tipo de comprobante seleccionado. Debe crear un rango de comprobantes antes de activar la factura.'
                : 'Seleccione un tipo de comprobante para verificar la disponibilidad de NCF.'
            }
          </p>
        </div>
      )}
    </>
  );
};

export default FacturaAlerts;

