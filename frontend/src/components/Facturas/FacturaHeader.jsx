import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileText } from "lucide-react";

/**
 * Header del formulario de factura con botones de acción
 */
const FacturaHeader = ({ 
  isEditMode, 
  onBack, 
  onSave, 
  onGeneratePDF,
  isSaving, 
  isGeneratingPDF,
  canGeneratePDF,
  isFacturaEditable
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
          {isEditMode ? 'Editar Factura' : 'Nueva Factura'}
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
          disabled={isSaving || !isFacturaEditable}
          className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
};

export default FacturaHeader;

