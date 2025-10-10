import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import CotizacionesApi from "../../services/cotizaciones.api";
import { generateCotizacionPDF } from "../../utils/pdfGenerator";
import { calcularTotales, prepararCotizacionData, validarDatosParaPDF } from "../../utils/cotizacionUtils";
import { DEFAULT_ITBIS_RATE } from "../../constants/cotizacionConstants";
import { useCotizacionForm } from "../../hooks/useCotizacionForm";
import { useCotizacionDetalles } from "../../hooks/useCotizacionDetalles";
import CotizacionHeader from "../../components/Cotizaciones/CotizacionHeader";
import CotizacionInfoCard from "../../components/Cotizaciones/CotizacionInfoCard";
import DetallesTable from "../../components/Cotizaciones/DetallesTable";
import TotalesCard from "../../components/Cotizaciones/TotalesCard";
import CreateArticuloModal from "../../components/CreateArticuloModal";
import CreateClienteModal from "../../components/CreateClienteModal";
import Toast from "../../components/ui/toast";

const CotizacionesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Custom hooks para la lógica de negocio
  const {
    cotizacion,
    setCotizacion,
    clientes,
    productos,
    isLoading,
    error,
    setError,
    handleCotizacionChange,
    handleClienteCreated,
    handleArticuloCreated
  } = useCotizacionForm(id, isEditMode);

  const {
    detalles,
    setDetalles,
    handleAddDetalle,
    handleDetalleChange,
    handleRemoveDetalle,
    handleProductoChange,
    loadDetalles
  } = useCotizacionDetalles(id, isEditMode);

  // Estados UI
  const [itbisRate, setItbisRate] = useState(DEFAULT_ITBIS_RATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });
  const [isCreateArticuloModalOpen, setIsCreateArticuloModalOpen] = useState(false);
  const [isCreateClienteModalOpen, setIsCreateClienteModalOpen] = useState(false);

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Función para generar PDF de cotización
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setError(null);

      const clienteSeleccionado = validarDatosParaPDF(cotizacion, detalles, clientes);
      const fileName = generateCotizacionPDF(cotizacion, clienteSeleccionado, detalles, productos, itbisRate);
      
      showToast('success', `PDF generado exitosamente: ${fileName}`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setError(error.message || 'Error al generar el PDF de la cotización');
      showToast('error', error.message || 'Error al generar el PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Guardar cotización
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const totales = calcularTotales(detalles, itbisRate);
      const cotizacionData = prepararCotizacionData(cotizacion, detalles, totales, isEditMode);

      let cotizacionGuardada;
      if (isEditMode) {
        cotizacionGuardada = await CotizacionesApi.update(id, cotizacionData);
        showToast('success', 'Cotización actualizada exitosamente');
        
        // Recargar datos después de actualizar
        const cotizacionActualizada = await CotizacionesApi.getById(id);
        setCotizacion({
          ...cotizacionActualizada,
          fecha_emision: cotizacionActualizada.fecha_emision,
          fecha_vencimiento: cotizacionActualizada.fecha_vencimiento || ''
        });
        await loadDetalles();
      } else {
        cotizacionGuardada = await CotizacionesApi.create(cotizacionData);
        showToast('success', 'Cotización creada exitosamente');
        navigate(`/cotizaciones/${cotizacionGuardada.id}`);
      }
    } catch (error) {
      console.error('Error al guardar cotización:', error);
      setError('Error al guardar la cotización');
      showToast('error', 'Error al guardar la cotización');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/cotizaciones');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totales = calcularTotales(detalles, itbisRate);

  return (
    <div className="w-full px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <CotizacionHeader
          isEditMode={isEditMode}
          onBack={handleBack}
          onSave={handleSave}
          onGeneratePDF={handleGeneratePDF}
          isSaving={isSaving}
          isGeneratingPDF={isGeneratingPDF}
          canGeneratePDF={cotizacion.cliente && detalles.length > 0}
        />

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Información básica de la cotización */}
        <CotizacionInfoCard
          cotizacion={cotizacion}
          clientes={clientes}
          isEditMode={isEditMode}
          isLoading={isLoading}
          onCotizacionChange={handleCotizacionChange}
          onCrearCliente={() => setIsCreateClienteModalOpen(true)}
        />

        {/* Detalles de la cotización */}
        <DetallesTable
          detalles={detalles}
          productos={productos}
          isLoading={isLoading}
          onAddDetalle={handleAddDetalle}
          onDetalleChange={handleDetalleChange}
          onRemoveDetalle={handleRemoveDetalle}
          onProductoSelect={(index, productoId) => handleProductoChange(index, productoId, productos)}
          onCrearArticulo={() => setIsCreateArticuloModalOpen(true)}
        />

        {/* Totales */}
        <TotalesCard
          totales={totales}
          itbisRate={itbisRate}
          onItbisRateChange={setItbisRate}
        />

        {/* Toast notifications */}
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        {/* Modal para crear artículo */}
        <CreateArticuloModal
          isOpen={isCreateArticuloModalOpen}
          onClose={() => setIsCreateArticuloModalOpen(false)}
          onArticuloCreated={handleArticuloCreated}
        />

        {/* Modal para crear cliente */}
        <CreateClienteModal
          isOpen={isCreateClienteModalOpen}
          onClose={() => setIsCreateClienteModalOpen(false)}
          onClienteCreated={handleClienteCreated}
        />
      </div>
    </div>
  );
};

export default CotizacionesDetails;
