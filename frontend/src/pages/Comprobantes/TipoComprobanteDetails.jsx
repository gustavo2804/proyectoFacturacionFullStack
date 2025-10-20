import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Toast from "../../components/ui/toast";
import { TipoComprobantesApi } from "../../services/comprobantes.api";

const TipoComprobanteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [tipoComprobante, setTipoComprobante] = useState({
    tipo_comprobante: '',
    descripcion: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!isEditMode); // Si es nuevo, empezar en modo edición
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (id && id !== 'nuevo') {
      fetchTipoComprobante();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchTipoComprobante = async () => {
    try {
      setIsLoading(true);
      const data = await TipoComprobantesApi.getById(id);
      setTipoComprobante(data);
    } catch (error) {
      console.error('Error al cargar tipo de comprobante:', error);
      setError('Error al cargar el tipo de comprobante');
      showToast('error', 'Error al cargar el tipo de comprobante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTipoComprobante(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Validaciones
      if (!tipoComprobante.tipo_comprobante.trim()) {
        showToast('error', 'El tipo de comprobante es requerido');
        return;
      }
      if (!tipoComprobante.descripcion.trim()) {
        showToast('error', 'La descripción es requerida');
        return;
      }

      if (isEditMode) {
        // Actualizar tipo de comprobante existente
        await TipoComprobantesApi.update(id, tipoComprobante);
        showToast('success', 'Tipo de comprobante actualizado exitosamente');
        setIsEditing(false);
      } else {
        // Crear nuevo tipo de comprobante
        await TipoComprobantesApi.create(tipoComprobante);
        showToast('success', 'Tipo de comprobante creado exitosamente');
        navigate('/comprobantes/tipos');
      }
    } catch (error) {
      console.error('Error al guardar tipo de comprobante:', error);
      setError('Error al guardar los cambios');
      showToast('error', 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (isEditMode) {
      // Modo edición: recargar datos originales
      try {
        await fetchTipoComprobante();
        setIsEditing(false);
      } catch (error) {
        // Error ya manejado en fetchTipoComprobante
      }
    } else {
      // Modo creación: volver a la lista
      navigate('/comprobantes/tipos');
    }
  };

  const handleBack = () => {
    navigate('/comprobantes/tipos');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este tipo de comprobante?')) {
      try {
        await TipoComprobantesApi.delete(id);
        showToast('success', 'Tipo de comprobante eliminado exitosamente');
        navigate('/comprobantes/tipos');
      } catch (error) {
        console.error('Error al eliminar tipo de comprobante:', error);
        showToast('error', 'Error al eliminar el tipo de comprobante');
      }
    }
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
        <div className="flex justify-between items-center">
          <div>
            <button 
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
            >
              ← Volver
            </button>
                   <h1 className="text-3xl font-bold text-gray-900">
                     {isEditMode ? tipoComprobante.tipo_comprobante : 'Nuevo Tipo de Comprobante'}
                   </h1>
            <p className="text-gray-600 mt-2">
              {isEditMode 
                ? 'Detalles del tipo de comprobante' 
                : 'Crear un nuevo tipo de comprobante'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing && isEditMode && (
              <>
                <button 
                  onClick={handleEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Editar
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Main Content */}
               <div className="bg-white border border-gray-200 rounded-lg p-6">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Tipo de Comprobante</h3>
                 <div className="grid grid-cols-1 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Comprobante *</label>
                     <input
                       type="text"
                       value={tipoComprobante.tipo_comprobante}
                       onChange={(e) => handleInputChange('tipo_comprobante', e.target.value)}
                       disabled={!isEditing}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                     <textarea
                       value={tipoComprobante.descripcion}
                       onChange={(e) => handleInputChange('descripcion', e.target.value)}
                       disabled={!isEditing}
                       rows={4}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                     />
                   </div>
                 </div>
               </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-2">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-red-50 hover:border-red-500 hover:text-red-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
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

export default TipoComprobanteDetails;
