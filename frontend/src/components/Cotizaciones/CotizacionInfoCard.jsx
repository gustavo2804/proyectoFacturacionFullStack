import { Card, CardContent, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import SearchSelectCliente from "../SearchSelectCliente";
import { ESTADOS_COTIZACION } from "../../constants/cotizacionConstants";

/**
 * Card con la información básica de la cotización
 */
const CotizacionInfoCard = ({
  cotizacion,
  clientes,
  isEditMode,
  isLoading,
  onCotizacionChange,
  onCrearCliente
}) => {
  return (
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
              onChange={(value) => onCotizacionChange('cliente', value)}
              clientes={clientes}
              placeholder="Buscar y seleccionar cliente..."
              isDisabled={isLoading}
              topLimit={10}
              onCrearCliente={onCrearCliente}
            />
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
              Estado
            </Label>
            <Select 
              value={cotizacion.anulado.toString()} 
              onValueChange={(value) => onCotizacionChange('anulado', value === 'true')}
            >
              <SelectTrigger className="bg-white border divider-border hover:bg-gray-50">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="bg-white border divider-border shadow-lg">
                {ESTADOS_COTIZACION.map((estado) => (
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
              onChange={(e) => onCotizacionChange('fecha_emision', e.target.value)}
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
              onChange={(e) => onCotizacionChange('fecha_vencimiento', e.target.value)}
              className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CotizacionInfoCard;

