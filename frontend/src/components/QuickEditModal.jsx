import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import ClienteForm from "./ClienteForm";
import ClientesApi from "../services/clientes.api";

const QuickEditModal = ({ isOpen, onClose, clienteId, onSuccess }) => {
  const [cliente, setCliente] = useState({
    nombre: '',
    tipo_documento: '',
    numero_documento: '',
    tipo_ncf: ''
  });
  
  const [originalCliente, setOriginalCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (isOpen && clienteId) {
      fetchCliente();
    }
  }, [isOpen, clienteId]);

  const fetchCliente = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ClientesApi.getById(clienteId);
      setCliente(data);
      setOriginalCliente(data);
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      setError('Error al cargar los datos del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      await ClientesApi.update(clienteId, cliente);
      
      // Notificar al componente padre que se actualizó
      if (onSuccess) {
        onSuccess(cliente);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      setError('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    if (originalCliente) {
      setCliente(originalCliente);
    }
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border divider-border shadow-lg max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">
            Edición Rápida - Cliente
          </DialogTitle>
        </DialogHeader>
        
        {/* Error message */}
        {error && (
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ClienteForm
            cliente={cliente}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={true}
            isSaving={isSaving}
            variant="quick"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickEditModal;
