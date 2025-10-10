import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import FacturasApi from "@/services/facturas.api";
import { generateFacturaPDF } from "@/utils/pdfGenerator";
import { calcularTotales, prepararFacturaData, validarDatosParaPDF } from "@/utils/facturaUtils";
import { useFacturaForm } from "@/hooks/useFacturaForm";
import { useFacturaDetalles } from "@/hooks/useFacturaDetalles";
import { useNCFManagement } from "@/hooks/useNCFManagement";
import FacturaHeader from "@/components/Facturas/FacturaHeader";
import FacturaInfoCard from "@/components/Facturas/FacturaInfoCard";
import FacturaDetallesTable from "@/components/Facturas/FacturaDetallesTable";
import FacturaAlerts from "@/components/Facturas/FacturaAlerts";
import TotalesCard from "@/components/Cotizaciones/TotalesCard";
import CreateArticuloModal from "@/components/CreateArticuloModal";
import CreateClienteModal from "@/components/CreateClienteModal";

const FacturasDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  console.log('FacturasDetails - id:', id);
  console.log('FacturasDetails - isEditMode:', isEditMode);

  // Custom hooks para la lógica de negocio
  const {
    factura,
    clientes,
    productos,
    tiposComprobante,
    isLoading,
    error,
    setError,
    isFacturaEditable,
    handleFacturaChange,
    handleClienteCreated,
    handleArticuloCreated
  } = useFacturaForm(id, isEditMode);

  const {
    detalles,
    handleAddDetalle,
    handleDetalleChange,
    handleRemoveDetalle,
    handleProductoChange
  } = useFacturaDetalles(id, isEditMode);

  const {
    ncfDisponible,
    isLoadingNCF
  } = useNCFManagement(factura.tipo_comprobante, factura.estado, factura.ncf_asignado);

  // Estados UI
  const [itbisRate, setItbisRate] = useState(0.18);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isCreateArticuloModalOpen, setIsCreateArticuloModalOpen] = useState(false);
  const [isCreateClienteModalOpen, setIsCreateClienteModalOpen] = useState(false);

  // Función para generar PDF
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setError(null);

      const clienteSeleccionado = validarDatosParaPDF(factura, detalles, clientes);
      const fileName = generateFacturaPDF(factura, clienteSeleccionado, detalles, productos, itbisRate);
      
      console.log(`PDF generado: ${fileName}`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setError(error.message || 'Error al generar el PDF de la factura');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Guardar factura
  const handleSave = async () => {
    console.log('Guardando factura...');
    console.log(factura);
    console.log(detalles);
    try {
      setIsSaving(true);
      setError(null);

      const totales = calcularTotales(detalles, itbisRate);
      const facturaData = prepararFacturaData(factura, detalles, totales, isEditMode);

      console.log(facturaData);
      if (isEditMode) {
        await FacturasApi.update(id, facturaData);
      } else {
        await FacturasApi.create(facturaData);
      }

      navigate('/facturas');
    } catch (error) {
      console.error('Error al guardar factura:', error);
      setError('Error al guardar la factura');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/facturas');
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
          <p className="text-center text-gray-500 mt-4">Cargando factura...</p>
        </div>
      </div>
    );
  }

  const totales = calcularTotales(detalles, itbisRate);

  return (
    <div className="w-full px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <FacturaHeader
          isEditMode={isEditMode}
          onBack={handleBack}
          onSave={handleSave}
          onGeneratePDF={handleGeneratePDF}
          isSaving={isSaving}
          isGeneratingPDF={isGeneratingPDF}
          canGeneratePDF={factura.cliente && detalles.length > 0}
          isFacturaEditable={isFacturaEditable}
        />

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Alertas sobre el estado de la factura */}
        <FacturaAlerts
          factura={factura}
          isEditMode={isEditMode}
          isFacturaEditable={isFacturaEditable}
          ncfDisponible={ncfDisponible}
        />

        {/* Información básica de la factura */}
        <FacturaInfoCard
          factura={factura}
          clientes={clientes}
          tiposComprobante={tiposComprobante}
          ncfDisponible={ncfDisponible}
          isLoadingNCF={isLoadingNCF}
          isEditMode={isEditMode}
          isLoading={isLoading}
          isFacturaEditable={isFacturaEditable}
          onFacturaChange={handleFacturaChange}
          onCrearCliente={() => setIsCreateClienteModalOpen(true)}
        />

        {/* Detalles de la factura */}
        <FacturaDetallesTable
          detalles={detalles}
          productos={productos}
          isLoading={isLoading}
          isFacturaEditable={isFacturaEditable}
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
          disabled={!isFacturaEditable}
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

export default FacturasDetails;
