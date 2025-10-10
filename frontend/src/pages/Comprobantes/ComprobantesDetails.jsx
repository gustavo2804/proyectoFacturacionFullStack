import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { SerieComprobantesApi } from "../../services/comprobantes.api";
import { useComprobanteForm } from "../../hooks/useComprobanteForm";
import ComprobanteHeader from "../../components/Comprobantes/ComprobanteHeader";
import ComprobanteFormCard from "../../components/Comprobantes/ComprobanteFormCard";
import AnularSerieModal from "../../components/Comprobantes/AnularSerieModal";
import Toast from "../../components/ui/toast";

const ComprobantesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Custom hook para la lógica del formulario
  const {
    serieComprobante,
    tiposComprobante,
    isLoading,
    error,
    setError,
    handleInputChange
  } = useComprobanteForm(id, isEditMode);

  const [isSaving, setIsSaving] = useState(false);
  const [isAnulando, setIsAnulando] = useState(false);
  const [isAnularModalOpen, setIsAnularModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Guardar serie comprobante
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      if (isEditMode) {
        await SerieComprobantesApi.update(id, serieComprobante);
      } else {
        await SerieComprobantesApi.create(serieComprobante);
      }
      
      navigate('/comprobantes');
    } catch (error) {
      console.error('Error al guardar serie comprobante:', error);
      
      // Manejar errores de validación del backend
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Si es un error de validación específico
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return messages.join(', ');
              }
              return messages;
            })
            .join('. ');
          setError(errorMessages || 'Error al guardar la serie de comprobante');
        } else if (typeof errorData === 'string') {
          setError(errorData);
        } else {
          setError('Error al guardar la serie de comprobante');
        }
      } else {
        setError('Error al guardar la serie de comprobante');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/comprobantes');
  };

  // Anular serie de comprobantes
  const handleAnular = async () => {
    try {
      setIsAnulando(true);
      setError(null);
      
      const response = await SerieComprobantesApi.anular(id);
      
      showToast('success', `Serie anulada exitosamente. ${response.comprobantes_anulados} comprobantes fueron anulados.`);
      
      // Recargar la serie después de anular
      setTimeout(() => {
        navigate('/comprobantes');
      }, 2000);
      
    } catch (error) {
      console.error('Error al anular serie:', error);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData.error) {
          setError(errorData.error);
        } else if (typeof errorData === 'string') {
          setError(errorData);
        } else {
          setError('Error al anular la serie de comprobante');
        }
      } else {
        setError('Error al anular la serie de comprobante');
      }
      
      showToast('error', 'Error al anular la serie de comprobante');
    } finally {
      setIsAnulando(false);
      setIsAnularModalOpen(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full px-8 py-6">
        <div className="max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <ComprobanteHeader
          isEditMode={isEditMode}
          onBack={handleBack}
          onSave={handleSave}
          isSaving={isSaving}
          onAnular={() => setIsAnularModalOpen(true)}
          isAnulado={serieComprobante.anulado}
        />

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Formulario del comprobante */}
        <ComprobanteFormCard
          serieComprobante={serieComprobante}
          tiposComprobante={tiposComprobante}
          onInputChange={handleInputChange}
        />

        {/* Modal de confirmación para anular */}
        <AnularSerieModal
          isOpen={isAnularModalOpen}
          onClose={() => setIsAnularModalOpen(false)}
          onConfirm={handleAnular}
          isAnulando={isAnulando}
        />

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

export default ComprobantesDetails;
