import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Header del formulario/detalle de cliente
 */
const ClienteHeader = ({ 
  isEditMode, 
  isEditing,
  onBack
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
          {!isEditMode ? 'Nuevo Cliente' : isEditing ? 'Editar Cliente' : 'Detalles del Cliente'}
        </h1>
      </div>
      
      <div className="w-[120px]">
        {/* Espacio para mantener centrado el título */}
      </div>
    </div>
  );
};

export default ClienteHeader;

