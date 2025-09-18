import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CotizacionesApi, { DetalleCotizacionApi } from "../../services/cotizaciones.api";
import ClientesApi from "../../services/clientes.api";
import { ProductosApi } from "../../services/facturas.api";
import { generateCotizacionPDF } from "../../utils/pdfGenerator";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { ArrowLeft, Plus, Trash2, Save, FileText } from "lucide-react";
import SearchSelectCliente from "../../components/SearchSelectCliente";
import SearchSelectProducto from "../../components/SearchSelectProducto";
import ItbisSelect from "../../components/ItbisSelect";
import Toast from "../../components/ui/toast";

const CotizacionesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Estados principales
  const [cotizacion, setCotizacion] = useState({
    numero_cotizacion: '',
    cliente: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    anulado: false,
    total: 0
  });

  const [itbisRate, setItbisRate] = useState(0.18); // 18% por defecto

  const [detalles, setDetalles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Estados de cotización
  const estadosCotizacion = [
    { value: false, label: 'Activa' },
    { value: true, label: 'Anulada' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar clientes y productos en paralelo
        const [clientesData, productosData] = await Promise.all([
          ClientesApi.getAll(),
          ProductosApi.getAll()
        ]);
        
        setClientes(clientesData);
        setProductos(productosData);

        // Si es modo edición, cargar cotización
        if (isEditMode) {
          const [cotizacionData, detallesData] = await Promise.all([
            CotizacionesApi.getById(id),
            DetalleCotizacionApi.getByCotizacionId(id)
          ]);
          
          setCotizacion({
            ...cotizacionData,
            fecha_emision: cotizacionData.fecha_emision,
            fecha_vencimiento: cotizacionData.fecha_vencimiento || ''
          });
          // Asegurar que los subtotales sean números válidos
          const detallesConSubtotalValido = detallesData.map(detalle => ({
            ...detalle,
            cantidad: parseFloat(detalle.cantidad) || 0,
            precio_unitario: parseFloat(detalle.precio_unitario) || 0,
            subtotal: parseFloat(detalle.subtotal) || 0
          }));
          setDetalles(detallesConSubtotalValido);
        } else {
          // Para nuevas cotizaciones, el número se generará automáticamente en el backend
          setCotizacion(prev => ({
            ...prev,
            numero_cotizacion: 'Auto-generado'
          }));
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

  // Manejar cambios en los campos de la cotización
  const handleCotizacionChange = (field, value) => {
    setCotizacion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Agregar nuevo detalle
  const handleAddDetalle = () => {
    const nuevoDetalle = {
      id: Date.now(), // ID temporal
      producto: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0
    };
    setDetalles(prev => [...prev, nuevoDetalle]);
  };

  // Manejar cambios en los detalles
  const handleDetalleChange = (index, field, value) => {
    setDetalles(prev => {
      const nuevosDetalles = [...prev];
      nuevosDetalles[index] = {
        ...nuevosDetalles[index],
        [field]: value
      };

      // Calcular subtotal cuando cambia cantidad o precio
      if (field === 'cantidad' || field === 'precio_unitario') {
        const cantidad = field === 'cantidad' ? parseFloat(value) || 0 : parseFloat(nuevosDetalles[index].cantidad) || 0;
        const precio = field === 'precio_unitario' ? parseFloat(value) || 0 : parseFloat(nuevosDetalles[index].precio_unitario) || 0;
        nuevosDetalles[index].subtotal = cantidad * precio;
      }

      return nuevosDetalles;
    });
  };

  // Eliminar detalle
  const handleRemoveDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  // Cuando cambia el producto, actualizar el precio
  const handleProductoChange = (index, productoId) => {
    const producto = productos.find(p => p.id === parseInt(productoId));
    if (producto) {
      handleDetalleChange(index, 'producto', productoId);
      handleDetalleChange(index, 'precio_unitario', producto.precio || 0);
    }
  };

  // Función para generar PDF de cotización
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setError(null);

      // Obtener datos del cliente seleccionado
      const clienteSeleccionado = clientes.find(c => c.id === parseInt(cotizacion.cliente));
      
      if (!clienteSeleccionado) {
        setError('Debe seleccionar un cliente para generar el PDF');
        return;
      }

      if (detalles.length === 0) {
        setError('Debe agregar al menos un producto para generar el PDF');
        return;
      }

      // Generar el PDF
      const fileName = generateCotizacionPDF(cotizacion, clienteSeleccionado, detalles, productos);
      
      // Mostrar mensaje de éxito
      showToast('success', `PDF generado exitosamente: ${fileName}`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setError('Error al generar el PDF de la cotización');
      showToast('error', 'Error al generar el PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Calcular totales
  const calcularTotales = () => {
    const subtotal = detalles.reduce((sum, detalle) => {
      const detalleSubtotal = parseFloat(detalle.subtotal) || 0;
      return sum + detalleSubtotal;
    }, 0);
    const itbis = subtotal * (parseFloat(itbisRate) || 0);
    const total = subtotal + itbis;

    return {
      subtotal: subtotal.toFixed(2),
      itbis: itbis.toFixed(2),
      total: total.toFixed(2),
      itbisPercentage: ((parseFloat(itbisRate) || 0) * 100).toFixed(0)
    };
  };

  // Guardar cotización
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const totales = calcularTotales();
      
      // Preparar los detalles para enviar
      const detalle_cotizaciones = detalles.map(detalle => ({
        producto: parseInt(detalle.producto),
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal
      }));

      const cotizacionData = {
        ...cotizacion,
        total: parseFloat(totales.total),
        detalle_cotizaciones: detalle_cotizaciones
      };

      // Para nuevas cotizaciones, no enviar el número (se genera automáticamente)
      if (!isEditMode) {
        delete cotizacionData.numero_cotizacion;
      }

      let cotizacionGuardada;
      if (isEditMode) {
        cotizacionGuardada = await CotizacionesApi.update(id, cotizacionData);
        showToast('success', 'Cotización actualizada exitosamente');
      } else {
        cotizacionGuardada = await CotizacionesApi.create(cotizacionData);
        showToast('success', 'Cotización creada exitosamente');
        navigate(`/cotizaciones/${cotizacionGuardada.id}`);
      }

      if (isEditMode) {
        // Recargar datos después de actualizar
        const [cotizacionData, detallesData] = await Promise.all([
          CotizacionesApi.getById(id),
          DetalleCotizacionApi.getByCotizacionId(id)
        ]);
        
        setCotizacion({
          ...cotizacionData,
          fecha_emision: cotizacionData.fecha_emision,
          fecha_vencimiento: cotizacionData.fecha_vencimiento || ''
        });
        // Asegurar que los subtotales sean números válidos
        const detallesConSubtotalValido = detallesData.map(detalle => ({
          ...detalle,
          cantidad: parseFloat(detalle.cantidad) || 0,
          precio_unitario: parseFloat(detalle.precio_unitario) || 0,
          subtotal: parseFloat(detalle.subtotal) || 0
        }));
        setDetalles(detallesConSubtotalValido);
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

  const totales = calcularTotales();

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
              {isEditMode ? 'Editar Cotización' : 'Nueva Cotización'}
            </h1>
          </div>
          
          <div className="flex gap-2">
            {/* Botón de generar PDF - solo visible si hay datos suficientes */}
            {(cotizacion.cliente && detalles.length > 0) && (
              <Button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                variant="outline"
                className="gap-2 rounded-md border-blue-500 bg-white text-blue-700 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4" />
                {isGeneratingPDF ? 'Generando...' : 'PDF'}
              </Button>
            )}
            
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

        {/* Información básica de la cotización */}
        <Card className="bg-white border rounded-xl divider-border shadow-md">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Información de la Cotización</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Número de cotización */}
              <div className="space-y-2">
                <Label htmlFor="numero_cotizacion" className="text-sm font-medium text-gray-700">
                  Número de Cotización
                </Label>
                <Input
                  id="numero_cotizacion"
                  value={cotizacion.numero_cotizacion}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border divider-border rounded-md"
                />
                {!isEditMode && (
                  <p className="text-xs text-gray-500">
                    Se generará automáticamente al guardar
                  </p>
                )}
              </div>

              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-sm font-medium text-gray-700">
                  Cliente
                </Label>
                <SearchSelectCliente
                  value={cotizacion.cliente}
                  onChange={(value) => handleCotizacionChange('cliente', value)}
                  clientes={clientes}
                  placeholder="Buscar y seleccionar cliente..."
                  isDisabled={isLoading}
                  topLimit={10}
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                  Estado
                </Label>
                <Select 
                  value={cotizacion.anulado.toString()} 
                  onValueChange={(value) => handleCotizacionChange('anulado', value === 'true')}
                >
                  <SelectTrigger className="bg-white border divider-border hover:bg-gray-50">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border divider-border shadow-lg">
                    {estadosCotizacion.map((estado) => (
                      <SelectItem 
                        key={estado.value.toString()} 
                        value={estado.value.toString()}
                        className="hover:bg-gray-50"
                      >
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de emisión */}
              <div className="space-y-2">
                <Label htmlFor="fecha_emision" className="text-sm font-medium text-gray-700">
                  Fecha de Emisión
                </Label>
                <Input
                  id="fecha_emision"
                  type="date"
                  value={cotizacion.fecha_emision}
                  onChange={(e) => handleCotizacionChange('fecha_emision', e.target.value)}
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Fecha de vencimiento */}
              <div className="space-y-2">
                <Label htmlFor="fecha_vencimiento" className="text-sm font-medium text-gray-700">
                  Fecha de Vencimiento
                </Label>
                <Input
                  id="fecha_vencimiento"
                  type="date"
                  value={cotizacion.fecha_vencimiento}
                  onChange={(e) => handleCotizacionChange('fecha_vencimiento', e.target.value)}
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la cotización */}
        <Card className="bg-white border rounded-xl divider-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Artículos</h2>
            <Button
              onClick={handleAddDetalle}
              size="sm"
              className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Agregar Artículo
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b divider-border">
                  <TableHead>Producto</TableHead>
                  <TableHead className="w-20">Cantidad</TableHead>
                  <TableHead className="w-32">Precio Unitario</TableHead>
                  <TableHead className="w-32">Subtotal</TableHead>
                  <TableHead className="w-20">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalles.map((detalle, index) => (
                  <TableRow key={index} className="border-b divider-border">
                    <TableCell>
                      <SearchSelectProducto
                        value={detalle.producto}
                        onChange={(value) => handleProductoChange(index, value)}
                        productos={productos}
                        placeholder="Buscar y seleccionar producto..."
                        isDisabled={isLoading}
                        topLimit={10}
                        onProductoSelect={(producto) => {
                          handleDetalleChange(index, 'precio_unitario', producto.precio || 0);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value) || '')}
                        className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="1"
                        min=""
                        value={detalle.precio_unitario}
                        onChange={(e) => handleDetalleChange(index, 'precio_unitario', parseFloat(e.target.value) || '')}
                        className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(parseFloat(detalle.subtotal) || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRemoveDetalle(index)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {detalles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No hay artículos agregados. Haz clic en "Agregar Artículo" para comenzar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Totales */}
        <Card className="bg-white border rounded-xl divider-border shadow-md">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              {/* Selector de ITBIS */}
              <div className="w-64">
                <ItbisSelect
                  value={itbisRate}
                  onChange={setItbisRate}
                  label="Tasa de ITBIS"
                />
              </div>
              
              {/* Totales */}
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${totales.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ITBIS ({totales.itbisPercentage}%):</span>
                  <span>${totales.itbis}</span>
                </div>
                <div className="border-t divider-border pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${totales.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

export default CotizacionesDetails;
