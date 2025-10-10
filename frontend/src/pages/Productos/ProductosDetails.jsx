import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProductosApi from "../../services/productos.api";
import { useProductoForm } from "../../hooks/useProductoForm";
import ProductoHeader from "../../components/Productos/ProductoHeader";
import ProductoFormCard from "../../components/Productos/ProductoFormCard";

const ProductosDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Custom hook para la lógica del formulario
  const {
    producto,
    isLoading,
    error,
    setError,
    handleInputChange
  } = useProductoForm(id, isEditMode);

  const [isSaving, setIsSaving] = useState(false);

  // Guardar producto
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      if (isEditMode) {
        await ProductosApi.update(id, producto);
      } else {
        await ProductosApi.create(producto);
      }
      
      navigate('/productos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setError('Error al guardar el producto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/productos');
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
        <ProductoHeader
          isEditMode={isEditMode}
          onBack={handleBack}
          onSave={handleSave}
          isSaving={isSaving}
        />

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Formulario del producto */}
        <ProductoFormCard
          producto={producto}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ProductosDetails;
