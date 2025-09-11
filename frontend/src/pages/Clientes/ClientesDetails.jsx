import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ClientesApi from "../../services/clientes.api";
import { TipoComprobantesApi } from "../../services/comprobantes.api";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import ClienteForm from "../../components/ClienteForm";
import Toast from "../../components/ui/toast";
import { 
  ClienteBasicInfo, 
  ClienteContactInfo, 
  ClienteFacturasHistory, 
  ClienteActivity 
} from "../../components/ClienteInfoCard";

const ClientesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [cliente, setCliente] = useState({
    nombre: '',
    tipo_documento: '',
    numero_documento: '',
    tipo_ncf: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  
  const [isEditing, setIsEditing] = useState(!isEditMode); // Si es nuevo, empezar en modo edición
  const [isLoading, setIsLoading] = useState(true); // Cargar tipos de comprobante siempre
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Cargar datos del cliente y tipos de comprobante
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Cargar tipos de comprobante siempre
        const tiposData = await TipoComprobantesApi.getAll();
        setTiposComprobante(tiposData);
        
        // Cargar cliente solo si estamos en modo edición
        if (isEditMode) {
          const clienteData = await ClientesApi.getById(id);
          setCliente(clienteData);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Manejar cambios en el formulario
  const handleInputChange = (name, value) => {
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
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
        setError(null);
        const data = await ClientesApi.getById(id);
        setCliente(data);
        setIsEditing(false);
      } catch (error) {
        console.error('Error al recargar datos:', error);
        setError('Error al cancelar la edición');
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

  // Renderizar contenido según la sección activa
  const renderMainContent = () => {
    if (isEditing && activeSection === 'basic') {
      return (
        <div className="space-y-6">
          <div className="bg-white border rounded-xl divider-border shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Editar Información Básica
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
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
              onChange={handleInputChange}
              isEditing={true}
              variant="full"
              tiposComprobante={tiposComprobante}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información básica */}
        <div className="lg:col-span-2">
          <ClienteBasicInfo 
            cliente={cliente} 
            onEdit={handleBasicEdit}
          />
        </div>
        
        {/* Información de contacto */}
        <ClienteContactInfo cliente={cliente} />
        
        {/* Historial de facturas */}
        <ClienteFacturasHistory cliente={cliente} />
        
        {/* Actividad reciente - full width */}
        <div className="lg:col-span-2">
          <ClienteActivity cliente={cliente} />
        </div>
      </div>
    );
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
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

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Main Content */}
        {renderMainContent()}
        
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
