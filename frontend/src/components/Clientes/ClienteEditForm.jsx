import { Button } from "../ui/button";
import ClienteForm from "../ClienteForm";

/**
 * Formulario de edición de cliente
 */
const ClienteEditForm = ({
  cliente,
  tiposComprobante,
  isSaving,
  onChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl divider-border shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Editar Información Básica
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-red-50 hover:border-red-500 hover:text-red-700 transition-colors"
            >
              Cancelar
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
        <ClienteForm
          cliente={cliente}
          onChange={onChange}
          isEditing={true}
          variant="full"
          tiposComprobante={tiposComprobante}
        />
      </div>
    </div>
  );
};

export default ClienteEditForm;

