import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FacturasApi, { ProductosApi, DetalleFacturaApi } from "@/services/facturas.api";
import ClientesApi from "@/services/clientes.api";
import { TipoComprobantesApi, ComprobantesApi } from "@/services/comprobantes.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Save, FileText, Download } from "lucide-react";
import SearchSelectCliente from "@/components/SearchSelectCliente";
import SearchSelectProducto from "@/components/SearchSelectProducto";
import ItbisSelect from "@/components/ItbisSelect";
import { generateFacturaPDF } from "@/utils/pdfGenerator";
import { ESTADOS_FACTURA, esEstadoEditable } from "@/config/facturaConfig";

const FacturasDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  console.log('FacturasDetails - id:', id);
  console.log('FacturasDetails - isEditMode:', isEditMode);

  // Estados principales
  const [factura, setFactura] = useState({
    numero_factura: '',
    cliente: '',
    tipo_comprobante: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    estado: 'Borrador',
    total: 0,
    ncf_asignado: null
  });

  const [itbisRate, setItbisRate] = useState(0.18); // 18% por defecto

  const [detalles, setDetalles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState(null);
  const [isFacturaEditable, setIsFacturaEditable] = useState(true);
  const [ncfDisponible, setNcfDisponible] = useState(null);
  const [isLoadingNCF, setIsLoadingNCF] = useState(false);


  // Estados de factura desde configuración
  const estadosFactura = ESTADOS_FACTURA;

  // Función para buscar NCF disponible
  const buscarNCFDisponible = async (tipoComprobanteId) => {
    if (!tipoComprobanteId) {
      setNcfDisponible(null);
      return;
    }

    try {
      setIsLoadingNCF(true);
      const data = await ComprobantesApi.getDisponibles(tipoComprobanteId);
      if (data.length > 0) {
        setNcfDisponible(data[0]); // Tomar el primer NCF disponible
      } else {
        setNcfDisponible(null);
      }
    } catch (error) {
      console.error('Error al buscar NCF disponible:', error);
      setNcfDisponible(null);
    } finally {
      setIsLoadingNCF(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar clientes, productos y tipos de comprobante en paralelo
        const [clientesData, productosData, tiposComprobanteData] = await Promise.all([
          ClientesApi.getAll(),
          ProductosApi.getAll(),
          TipoComprobantesApi.getAll()
        ]);

        console.log('FacturasDetails - Clientes cargados:', clientesData.length);
        console.log('FacturasDetails - Productos cargados:', productosData.length);
        console.log('FacturasDetails - Tipos de comprobante cargados:', tiposComprobanteData.length);
        console.log('FacturasDetails - Primer producto:', productosData[0]);
        
        setClientes(clientesData);
        setProductos(productosData);
        setTiposComprobante(tiposComprobanteData);

        // Si es modo edición, cargar factura
        if (isEditMode) {
          console.log('Cargando factura con ID:', id);
          const [facturaData, detallesData] = await Promise.all([
            FacturasApi.getById(id),
            DetalleFacturaApi.getByFacturaId(id)
          ]);
          
          console.log('Factura cargada:', facturaData);
          console.log('Detalles cargados para factura ID', id, ':', detallesData);
          console.log('Cantidad de detalles:', detallesData.length);
          
          // Determinar si la factura es editable basándose en el estado del backend
          const facturaEditable = esEstadoEditable(facturaData.estado);
          setIsFacturaEditable(facturaEditable);
          
          setFactura({
            ...facturaData,
            cliente: facturaData.cliente?.id || facturaData.cliente || '',
            tipo_comprobante: facturaData.tipo_comprobante?.id || facturaData.tipo_comprobante || '',
            fecha_emision: facturaData.fecha_emision,
            fecha_vencimiento: facturaData.fecha_vencimiento || '',
            ncf_asignado: facturaData.ncf_asignado || null
          });
          // Procesar los detalles para asegurar que el producto sea solo el ID y los valores numéricos sean correctos
          const detallesProcesados = detallesData.map(detalle => ({
            ...detalle,
            producto: detalle.producto?.id || detalle.producto || '',
            cantidad: parseInt(detalle.cantidad) || 0,
            precio_unitario: parseFloat(detalle.precio_unitario) || 0,
            subtotal: parseFloat(detalle.subtotal) || 0
          }));
          setDetalles(detallesProcesados);
        } else {
          // Para nuevas facturas, el número se generará automáticamente en el backend
          // No necesitamos calcularlo en el frontend
          setFactura(prev => ({
            ...prev,
            numero_factura: 'Auto-generado'
          }));
          // Las nuevas facturas siempre son editables
          setIsFacturaEditable(true);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Manejar cambios en los campos de la factura
  const handleFacturaChange = (field, value) => {
    setFactura(prev => ({
      ...prev,
      [field]: value
    }));

    // Si cambia el tipo de comprobante, buscar NCF disponible
    if (field === 'tipo_comprobante') {
      buscarNCFDisponible(value);
    }
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
      handleDetalleChange(index, 'precio_unitario', parseFloat(producto.precio_venta) || 0);
    }
  };

  // Función para generar PDF
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setError(null);

      // Obtener datos del cliente seleccionado
      const clienteSeleccionado = clientes.find(c => c.id === parseInt(factura.cliente));
      
      if (!clienteSeleccionado) {
        setError('Debe seleccionar un cliente para generar el PDF');
        return;
      }

      if (detalles.length === 0) {
        setError('Debe agregar al menos un producto para generar el PDF');
        return;
      }

      // Generar el PDF
      const fileName = generateFacturaPDF(factura, clienteSeleccionado, detalles, productos, itbisRate);
      
      // Mostrar mensaje de éxito (opcional)
      console.log(`PDF generado: ${fileName}`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setError('Error al generar el PDF de la factura');
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
    const itbis = subtotal * itbisRate;
    const total = subtotal + itbis;

    return {
      subtotal: subtotal.toFixed(2),
      itbis: itbis.toFixed(2),
      total: total.toFixed(2),
      itbisPercentage: (itbisRate * 100).toFixed(0)
    };
  };

  // Guardar factura
  const handleSave = async () => {
    console.log('Guardando factura...');
    console.log(factura);
    console.log(detalles);
    try {
      setIsSaving(true);
      setError(null);

      const totales = calcularTotales();
      
      // Preparar los detalles para enviar
      const detalle_facturas = detalles.map(detalle => ({
        producto: parseInt(detalle.producto) || detalle.producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal
      }));

      const facturaData = {
        ...factura,
        cliente: parseInt(factura.cliente) || factura.cliente,
        tipo_comprobante: parseInt(factura.tipo_comprobante) || factura.tipo_comprobante,
        total: parseFloat(totales.total),
        detalle_facturas: detalle_facturas
      };

      // Para nuevas facturas, no enviar el número de factura (se genera automáticamente)
      if (!isEditMode) {
        delete facturaData.numero_factura;
      }

      let facturaGuardada;
      console.log(facturaData);
      if (isEditMode) {
        facturaGuardada = await FacturasApi.update(id, facturaData);
      } else {
        console.log('Guardando factura...');
        console.log(facturaData);
        facturaGuardada = await FacturasApi.create(facturaData);
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
              {isEditMode ? 'Editar Factura' : 'Nueva Factura'}
            </h1>
          </div>
          
          <div className="flex gap-2">
            {/* Botón de generar PDF - solo visible si hay datos suficientes */}
            {(factura.cliente && detalles.length > 0) && (
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
              disabled={isSaving || !isFacturaEditable}
              className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Info message cuando la factura no es editable */}
        {!isFacturaEditable && isEditMode && (
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg text-blue-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Factura en estado "{factura.estado}"</span>
            </div>
            <p className="text-sm mt-1">
              Esta factura ya fue guardada en un estado final y no puede ser modificada. Solo se puede visualizar y generar PDF.
            </p>
          </div>
        )}

        {/* Info message cuando se va a activar la factura */}
        {factura.estado === 'Activa' && !factura.ncf_asignado && isFacturaEditable && (
          <div className={`p-4 border rounded-lg ${
            ncfDisponible 
              ? 'border-green-200 bg-green-50 text-green-700' 
              : factura.tipo_comprobante 
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-orange-200 bg-orange-50 text-orange-700'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                ncfDisponible 
                  ? 'bg-green-500' 
                  : factura.tipo_comprobante 
                    ? 'bg-red-500'
                    : 'bg-orange-500'
              }`}></div>
              <span className="font-medium">Factura en estado "Activa"</span>
            </div>
            <p className="text-sm mt-1">
              {ncfDisponible 
                ? `Al guardar esta factura, se asignará automáticamente el NCF: ${ncfDisponible.numero_comprobante_completo} (${ncfDisponible.tipo_comprobante?.tipo_comprobante || 'N/A'})`
                : factura.tipo_comprobante 
                  ? 'No hay NCF disponibles para el tipo de comprobante seleccionado. Debe crear un rango de comprobantes antes de activar la factura.'
                  : 'Seleccione un tipo de comprobante para verificar la disponibilidad de NCF.'
              }
            </p>
          </div>
        )}

        {/* Información básica de la factura */}
        <Card className="bg-white border rounded-xl divider-border shadow-md [[memory:7140669]]">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Información de la Factura</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Número de factura */}
              <div className="space-y-2">
                <Label htmlFor="numero_factura" className="text-sm font-medium text-gray-700">
                  Número de Factura
                </Label>
                <Input
                  id="numero_factura"
                  value={factura.numero_factura}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border divider-border rounded-md"
                />
                {!isEditMode && (
                  <p className="text-xs text-gray-500">
                    Se generará automáticamente al guardar
                  </p>
                )}
              </div>

              {/* NCF Asignado */}
              <div className="space-y-2">
                <Label htmlFor="ncf_asignado" className="text-sm font-medium text-gray-700">
                  NCF Asignado
                </Label>
                <Input
                  id="ncf_asignado"
                  value={
                    factura.ncf_asignado?.numero_comprobante_completo || 
                    (isLoadingNCF ? 'Buscando...' : 
                     (ncfDisponible ? ncfDisponible.numero_comprobante_completo : 'Sin asignar'))
                  }
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border divider-border rounded-md"
                />
                {isLoadingNCF && (
                  <p className="text-xs text-blue-600">
                    Buscando NCF disponible...
                  </p>
                )}
                {!isLoadingNCF && factura.estado === 'Activa' && !factura.ncf_asignado && ncfDisponible && (
                  <p className="text-xs text-green-600">
                    NCF disponible: {ncfDisponible.numero_comprobante_completo} ({ncfDisponible.tipo_comprobante?.tipo_comprobante || 'N/A'})
                  </p>
                )}
                {!isLoadingNCF && factura.estado === 'Activa' && !factura.ncf_asignado && !ncfDisponible && factura.tipo_comprobante && (
                  <p className="text-xs text-red-600">
                    No hay NCF disponibles para este tipo de comprobante
                  </p>
                )}
                {!isLoadingNCF && factura.estado === 'Activa' && !factura.ncf_asignado && !factura.tipo_comprobante && (
                  <p className="text-xs text-orange-600">
                    Seleccione un tipo de comprobante para ver NCF disponible
                  </p>
                )}
                {factura.estado !== 'Activa' && (
                  <p className="text-xs text-gray-500">
                    Solo se asigna en estado "Activa"
                  </p>
                )}
              </div>

              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-sm font-medium text-gray-700">
                  Cliente
                </Label>
                <SearchSelectCliente
                  value={factura.cliente}
                  onChange={(value) => handleFacturaChange('cliente', value)}
                  clientes={clientes}
                  placeholder="Buscar y seleccionar cliente..."
                  isDisabled={isLoading || !isFacturaEditable}
                  topLimit={10}
                />
              </div>

              {/* Tipo de comprobante */}
              <div className="space-y-2">
                <Label htmlFor="tipo_comprobante" className="text-sm font-medium text-gray-700">
                  Tipo de RNC/Comprobante
                </Label>
                <Select 
                  value={factura.tipo_comprobante} 
                  onValueChange={(value) => handleFacturaChange('tipo_comprobante', value)}
                  disabled={!isFacturaEditable}
                >
                  <SelectTrigger className="bg-white border divider-border hover:bg-gray-50 [[memory:7140669]] disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Seleccionar tipo">
                      {factura.ncf_asignado && factura.ncf_asignado.tipo_comprobante ? (
                        `${factura.ncf_asignado.tipo_comprobante.tipo_comprobante} - ${factura.ncf_asignado.tipo_comprobante.descripcion}`
                      ) : (
                        tiposComprobante.find(tipo => tipo.id === parseInt(factura.tipo_comprobante))?.tipo_comprobante + 
                        (tiposComprobante.find(tipo => tipo.id === parseInt(factura.tipo_comprobante))?.descripcion ? 
                          ` - ${tiposComprobante.find(tipo => tipo.id === parseInt(factura.tipo_comprobante))?.descripcion}` : '')
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white border divider-border shadow-lg [[memory:7140669]]">
                    {tiposComprobante.map((tipo) => (
                      <SelectItem 
                        key={tipo.id} 
                        value={tipo.id.toString()}
                        className="hover:bg-gray-50 [[memory:7140669]]"
                      >
                        {tipo.tipo_comprobante} - {tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fecha de emisión */}
              <div className="space-y-2">
                <Label htmlFor="fecha_emision" className="text-sm font-medium text-gray-700">
                  Fecha de Emisión
                </Label>
                <Input
                  id="fecha_emision"
                  type="date"
                  value={factura.fecha_emision}
                  onChange={(e) => handleFacturaChange('fecha_emision', e.target.value)}
                  disabled={!isFacturaEditable}
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                  value={factura.fecha_vencimiento}
                  onChange={(e) => handleFacturaChange('fecha_vencimiento', e.target.value)}
                  disabled={!isFacturaEditable}
                  className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                  Estado
                </Label>
                <Select 
                  value={factura.estado} 
                  onValueChange={(value) => handleFacturaChange('estado', value)}
                  disabled={!isFacturaEditable}
                >
                  <SelectTrigger className="bg-white border divider-border hover:bg-gray-50 [[memory:7140669]] disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border divider-border shadow-lg [[memory:7140669]]">
                    {estadosFactura.map((estado) => (
                      <SelectItem 
                        key={estado.value} 
                        value={estado.value}
                        className="hover:bg-gray-50 [[memory:7140669]]"
                      >
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la factura */}
        <Card className="bg-white border rounded-xl divider-border shadow-md [[memory:7140669]]">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Artículos</h2>
            <Button
              onClick={handleAddDetalle}
              size="sm"
              disabled={!isFacturaEditable}
              className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        isDisabled={isLoading || !isFacturaEditable}
                        topLimit={10}
                        onProductoSelect={(producto) => {
                          handleDetalleChange(index, 'precio_unitario', producto.precio || '');
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value) || '')}
                        disabled={!isFacturaEditable}
                        className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="1"
                        min=""
                        value={detalle.precio_unitario}
                        onChange={(e) => handleDetalleChange(index, 'precio_unitario', parseFloat(e.target.value) || '')}
                        disabled={!isFacturaEditable}
                        className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${detalle.subtotal?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRemoveDetalle(index)}
                        size="sm"
                        variant="outline"
                        disabled={!isFacturaEditable}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!isFacturaEditable}
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
      </div>
    </div>
  );
};

export default FacturasDetails;
