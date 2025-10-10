import { Button } from "../ui/button";
import { ArrowLeft, Save, FileText } from "lucide-react";

/**
 * Header del formulario de cotización con botones de acción
 */
const CotizacionHeader = ({ 
  isEditMode, 
  onBack, 
  onSave, 
  onGeneratePDF,
  isSaving, 
  isGeneratingPDF,
  canGeneratePDF 
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
          {isEditMode ? 'Editar Cotización' : 'Nueva Cotización'}
        </h1>
      </div>
      
      <div className="flex gap-2">
        {canGeneratePDF && (
          <Button
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
            variant="outline"
            className="gap-2 rounded-md border-blue-500 bg-white text-blue-700 hover:bg-blue-500 hover:text-white transition-colors"
          >
            <FileText className="h-4 w-4" />
            {isGeneratingPDF ? 'Generando...' : 'PDF'}
          </Button>
        )}
        
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
};

export default CotizacionHeader;

