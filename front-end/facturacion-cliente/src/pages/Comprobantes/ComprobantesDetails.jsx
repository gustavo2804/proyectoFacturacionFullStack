import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SerieComprobantesApi, TipoComprobantesApi } from "../../services/comprobantes.api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

const ComprobantesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [serieComprobante, setSerieComprobante] = useState({
    tipo_comprobante: '',
    desde: 1,
    hasta: 100,
    numero_actual: 1,
    fecha_vencimiento: ''
  });

  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar tipos de comprobante
        const tiposData = await TipoComprobantesApi.getAll();
        
        console.log('Tipos de comprobante cargados:', tiposData);
        
        setTiposComprobante(tiposData);

        // Si es modo edición, cargar serie comprobante
        if (isEditMode) {
          const serieData = await SerieComprobantesApi.getById(id);
          setSerieComprobante({
            ...serieData,
            fecha_vencimiento: serieData.fecha_vencimiento || ''
          });
        } else {
          // Generar número actual automático basado en el rango desde-hasta
          const series = await SerieComprobantesApi.getAll();
          const numeros = series
            .map(s => parseInt(s.numero_actual) || 0)
            .filter(num => !isNaN(num));
          const ultimoNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
          setSerieComprobante(prev => ({
            ...prev,
            numero_actual: ultimoNumero + 1
          }));
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        let errorMessage = 'Error al cargar los datos';
        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${error.response.data?.detail || error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'Error de conexión. Verifica que el servidor esté disponible.';
        } else {
          errorMessage = error.message || 'Error desconocido';
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setSerieComprobante(prev => ({
      ...prev,
      [field]: value
    }));
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
      setError('Error al guardar la serie de comprobante');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/comprobantes');
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
              {isEditMode ? 'Editar Serie Comprobante' : 'Nueva Serie Comprobante'}
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

        {/* Formulario del comprobante */}
        <Card className="bg-white border rounded-xl divider-border shadow-md [[memory:7140669]]">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Información de la Serie Comprobante</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Desde */}
              <div className="space-y-2">
                <Label htmlFor="desde" className="text-sm font-medium text-gray-700">
                  Desde
                </Label>
                <Input
                  id="desde"
                  type="number"
                  min="1"
                  value={serieComprobante.desde}
                  onChange={(e) => handleInputChange('desde', parseInt(e.target.value) || 1)}
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="1"
                  required
                />
              </div>

              {/* Hasta */}
              <div className="space-y-2">
                <Label htmlFor="hasta" className="text-sm font-medium text-gray-700">
                  Hasta
                </Label>
                <Input
                  id="hasta"
                  type="number"
                  min="1"
                  value={serieComprobante.hasta}
                  onChange={(e) => handleInputChange('hasta', parseInt(e.target.value) || 100)}
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="100"
                  required
                />
              </div>

              {/* Número actual */}
              <div className="space-y-2">
                <Label htmlFor="numero_actual" className="text-sm font-medium text-gray-700">
                  Número Actual
                </Label>
                <Input
                  id="numero_actual"
                  type="number"
                  min="1"
                  value={serieComprobante.numero_actual}
                  onChange={(e) => handleInputChange('numero_actual', parseInt(e.target.value) || 1)}
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500">
                  Se generarán comprobantes desde {serieComprobante.desde} hasta {serieComprobante.hasta}
                </p>
              </div>
            </div>

            {/* Tipo de comprobante */}
            <div className="space-y-2">
              <Label htmlFor="tipo_comprobante" className="text-sm font-medium text-gray-700">
                Tipo de Comprobante
              </Label>
              <Select 
                value={serieComprobante.tipo_comprobante ? serieComprobante.tipo_comprobante.toString() : ''} 
                onValueChange={(value) => handleInputChange('tipo_comprobante', parseInt(value))}
              >
                <SelectTrigger className="bg-white border divider-border hover:bg-gray-50 [[memory:7140669]]">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white border divider-border shadow-lg [[memory:7140669]]">
                  {tiposComprobante.map((tipo) => (
                    <SelectItem 
                      key={tipo.id} 
                      value={tipo.id.toString()}
                      className="hover:bg-gray-50 [[memory:7140669]]"
                    >
                      {tipo.tipo_comprobante}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha de vencimiento */}
            <div className="space-y-2">
              <Label htmlFor="fecha_vencimiento" className="text-sm font-medium text-gray-700">
                Fecha de Vencimiento
              </Label>
              <Input
                id="fecha_vencimiento"
                type="date"
                value={serieComprobante.fecha_vencimiento}
                onChange={(e) => handleInputChange('fecha_vencimiento', e.target.value)}
                className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprobantesDetails;
