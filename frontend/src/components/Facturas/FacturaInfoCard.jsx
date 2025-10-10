import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import SearchSelectCliente from "@/components/SearchSelectCliente";
import { ESTADOS_FACTURA } from "@/config/facturaConfig";

/**
 * Card con la información básica de la factura
 */
const FacturaInfoCard = ({
  factura,
  clientes,
  tiposComprobante,
  ncfDisponible,
  isLoadingNCF,
  isEditMode,
  isLoading,
  isFacturaEditable,
  onFacturaChange,
  onCrearCliente
}) => {
  return (
    <Card className="bg-white border rounded-xl divider-border shadow-md">
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
                NCF disponible: {ncfDisponible.numero_comprobante_completo}
              </p>
            )}
            {!isLoadingNCF && factura.estado === 'Activa' && !factura.ncf_asignado && !ncfDisponible && factura.tipo_comprobante && (
              <p className="text-xs text-red-600">
                No hay NCF disponibles
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
              onChange={(value) => onFacturaChange('cliente', value)}
              clientes={clientes}
              placeholder="Buscar y seleccionar cliente..."
              isDisabled={isLoading || !isFacturaEditable}
              topLimit={10}
              onCrearCliente={onCrearCliente}
            />
          </div>

          {/* Tipo de comprobante */}
          <div className="space-y-2">
            <Label htmlFor="tipo_comprobante" className="text-sm font-medium text-gray-700">
              Tipo de RNC/Comprobante
            </Label>
            <Select 
              value={factura.tipo_comprobante} 
              onValueChange={(value) => onFacturaChange('tipo_comprobante', value)}
              disabled={!isFacturaEditable}
            >
              <SelectTrigger className="bg-white border divider-border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
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
              <SelectContent className="bg-white border divider-border shadow-lg">
                {tiposComprobante.map((tipo) => (
                  <SelectItem 
                    key={tipo.id} 
                    value={tipo.id.toString()}
                    className="hover:bg-gray-50"
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
              onChange={(e) => onFacturaChange('fecha_emision', e.target.value)}
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
              onChange={(e) => onFacturaChange('fecha_vencimiento', e.target.value)}
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
              onValueChange={(value) => onFacturaChange('estado', value)}
              disabled={!isFacturaEditable}
            >
              <SelectTrigger className="bg-white border divider-border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="bg-white border divider-border shadow-lg">
                {ESTADOS_FACTURA.map((estado) => (
                  <SelectItem 
                    key={estado.value} 
                    value={estado.value}
                    className="hover:bg-gray-50"
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
  );
};

export default FacturaInfoCard;

