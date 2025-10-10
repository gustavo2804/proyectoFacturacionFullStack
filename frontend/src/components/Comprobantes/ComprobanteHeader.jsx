import { Button } from "../ui/button";
import { ArrowLeft, Save, Ban } from "lucide-react";

/**
 * Header del formulario de serie comprobante
 */
const ComprobanteHeader = ({ 
  isEditMode, 
  onBack, 
  onSave, 
  isSaving,
  onAnular,
  isAnulado
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2 rounded-md border-emerald-500 bg-white text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      
      <div className="flex-1 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Editar Serie Comprobante' : 'Nueva Serie Comprobante'}
        </h1>
      </div>
      
      <div className="flex gap-2">
        {isEditMode && !isAnulado && (
          <Button
            onClick={onAnular}
            variant="outline"
            className="gap-2 rounded-md border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
          >
            <Ban className="h-4 w-4" />
            Anular
          </Button>
        )}
        <Button
          onClick={onSave}
          disabled={isSaving || isAnulado}
          className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
};

export default ComprobanteHeader;

