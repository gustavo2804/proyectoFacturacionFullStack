import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ClientesApi from "../../services/clientes.api";
import { useClienteForm } from "../../hooks/useClienteForm";
import ClienteHeader from "../../components/Clientes/ClienteHeader";
import ClienteEditForm from "../../components/Clientes/ClienteEditForm";
import ClienteViewContent from "../../components/Clientes/ClienteViewContent";
import Toast from "../../components/ui/toast";

const ClientesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Custom hook para la lógica del formulario
  const {
    cliente,
    tiposComprobante,
    isLoading,
    error,
    setError,
    handleInputChange,
    reloadCliente
  } = useClienteForm(id, isEditMode);

  const [isEditing, setIsEditing] = useState(!isEditMode); // Si es nuevo, empezar en modo edición
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      if (isEditMode) {
        // Actualizar cliente existente
        await ClientesApi.update(id, cliente);
        setIsEditing(false);
        showToast('success', 'Cliente actualizado exitosamente');
      } else {
        // Crear nuevo cliente
        console.log(cliente);
        const nuevoCliente = await ClientesApi.create(cliente);
        showToast('success', 'Cliente creado exitosamente');
        navigate(`/clientes/${nuevoCliente.id}`);
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setError('Error al guardar los cambios');
      showToast('error', 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancelar edición
  const handleCancel = async () => {
    if (isEditMode) {
      // Modo edición: recargar datos originales
      try {
        await reloadCliente();
        setIsEditing(false);
      } catch (error) {
        // Error ya manejado en reloadCliente
      }
    } else {
      // Modo creación: volver a la lista
      navigate('/clientes');
    }
  };

  // Volver a la lista
  const handleBack = () => {
    navigate('/clientes');
  };

  // Manejar edición de sección básica
  const handleBasicEdit = () => {
    setActiveSection('basic');
    setIsEditing(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <ClienteHeader
          isEditMode={isEditMode}
          isEditing={isEditing}
          onBack={handleBack}
        />

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Main Content */}
        {isEditing && activeSection === 'basic' ? (
          <ClienteEditForm
            cliente={cliente}
            tiposComprobante={tiposComprobante}
            isSaving={isSaving}
            onChange={handleInputChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <ClienteViewContent
            cliente={cliente}
            onEdit={handleBasicEdit}
          />
        )}
        
        {/* Toast notifications */}
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </div>
  );
};

export default ClientesDetails;
