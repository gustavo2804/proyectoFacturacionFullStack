import { Button } from "../ui/button";
import { ArrowLeft, Save } from "lucide-react";

/**
 * Header del formulario de producto
 */
const ProductoHeader = ({ 
  isEditMode, 
  onBack, 
  onSave, 
  isSaving 
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
          {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>
      
      <div className="w-[120px]">
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

export default ProductoHeader;

