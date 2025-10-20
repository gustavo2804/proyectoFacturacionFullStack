import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

/**
 * Modal de confirmación para anular una serie de comprobantes
 */
const AnularSerieModal = ({ isOpen, onClose, onConfirm, isAnulando }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="p-6">
          {/* Icono de advertencia */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          {/* Título */}
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
            ¿Anular Serie de Comprobantes?
          </h3>
          
          {/* Descripción */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-center text-gray-600">
              Esta acción anulará la serie de comprobantes y <strong>todos los comprobantes no asignados</strong> pertenecientes a esta serie.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. Los comprobantes ya asignados a facturas no serán afectados.
              </p>
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isAnulando}
              className="flex-1 hover:bg-red-50 hover:border-red-500 hover:text-red-700 transition-colors"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isAnulando}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isAnulando ? 'Anulando...' : 'Anular Serie'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnularSerieModal;

