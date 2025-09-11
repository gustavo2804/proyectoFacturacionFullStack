import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClienteForm from "./ClienteForm";
import ClientesApi from "../services/clientes.api";

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [cliente, setCliente] = useState({
    nombre: '',
    tipo_documento: '',
    numero_documento: '',
    tipo_ncf: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Limpiar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCliente({
        nombre: '',
        tipo_documento: '',
        numero_documento: '',
        tipo_ncf: ''
      });
      setError(null);
    }
  }, [isOpen]);

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
      
      // Validar que todos los campos requeridos estén llenos
      if (!cliente.nombre || !cliente.tipo_documento || !cliente.numero_documento || !cliente.tipo_ncf) {
        setError('Todos los campos son requeridos');
        return;
      }
      
      const newCliente = await ClientesApi.create(cliente);
      
      // Notificar al componente padre que se creó un nuevo cliente
      if (onSuccess) {
        onSuccess(newCliente);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al crear cliente:', error);
      setError('Error al crear el cliente');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Limpiar formulario
    setCliente({
      nombre: '',
      tipo_documento: '',
      numero_documento: '',
      tipo_ncf: ''
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border divider-border shadow-lg max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">
            Crear Nuevo Cliente
          </DialogTitle>
        </DialogHeader>
        
        {/* Error message */}
        {error && (
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <ClienteForm
          cliente={cliente}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={true}
          isSaving={isSaving}
          variant="quick"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
