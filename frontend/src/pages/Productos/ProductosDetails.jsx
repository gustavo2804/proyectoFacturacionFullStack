import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductosApi from "../../services/productos.api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

const ProductosDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [producto, setProducto] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del producto
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (isEditMode) {
          const data = await ProductosApi.getById(id);
          setProducto(data);
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setError('Error al cargar los datos del producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducto();
  }, [id, isEditMode]);

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setProducto(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
              {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>
          </div>
          
          <div className="w-[120px]">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Formulario del producto */}
        <Card className="bg-white border rounded-xl divider-border shadow-md [[memory:7140669]]">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Información del Producto</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código */}
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">
                  Código
                </Label>
                <Input
                  id="codigo"
                  type="text"
                  value={producto.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  placeholder="Código único del producto"
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={producto.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Nombre del producto"
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                Descripción
              </Label>
              <textarea
                id="descripcion"
                value={producto.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción detallada del producto"
                rows={4}
                className="w-full border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent p-3 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precio de Compra */}
              <div className="space-y-2">
                <Label htmlFor="precio_compra" className="text-sm font-medium text-gray-700">
                  Precio de Compra
                </Label>
                <Input
                  id="precio_compra"
                  type="number"
                  step="0.01"
                  min="0"
                  value={producto.precio_compra}
                  onChange={(e) => handleInputChange('precio_compra', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Precio de Venta */}
              <div className="space-y-2">
                <Label htmlFor="precio_venta" className="text-sm font-medium text-gray-700">
                  Precio de Venta
                </Label>
                <Input
                  id="precio_venta"
                  type="number"
                  step="0.01"
                  min="0"
                  value={producto.precio_venta}
                  onChange={(e) => handleInputChange('precio_venta', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Margen de ganancia calculado */}
            {producto.precio_compra > 0 && producto.precio_venta > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Margen de Ganancia:</span>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-600">
                      ${(producto.precio_venta - producto.precio_compra).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(((producto.precio_venta - producto.precio_compra) / producto.precio_compra) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductosDetails;
