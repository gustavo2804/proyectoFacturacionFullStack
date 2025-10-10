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

/**
 * Card con el formulario de serie comprobante
 */
const ComprobanteFormCard = ({ serieComprobante, tiposComprobante, onInputChange }) => {
  const isLocked = serieComprobante.tiene_comprobantes_generados;
  const isAnulado = serieComprobante.anulado;

  return (
    <Card className="bg-white border rounded-xl divider-border shadow-md">
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">Información de la Serie Comprobante</h2>
        {isAnulado && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>❌ Serie Anulada:</strong> Esta serie ha sido anulada y no se puede modificar.
            </p>
          </div>
        )}
        {!isAnulado && isLocked && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Serie bloqueada:</strong> Esta serie ya tiene comprobantes generados. 
              Solo se pueden modificar la fecha de vencimiento y el número actual.
            </p>
          </div>
        )}
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
              onChange={(e) => onInputChange('desde', parseInt(e.target.value) || '')}
              className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="1"
              required
              disabled={isLocked || isAnulado}
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
              onChange={(e) => onInputChange('hasta', parseInt(e.target.value) || '')}
              className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="100"
              required
              disabled={isLocked || isAnulado}
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
              
              value={serieComprobante.numero_actual}
              onChange={(e) => onInputChange('numero_actual', parseInt(e.target.value) || '')}
              className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isAnulado}
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
            onValueChange={(value) => onInputChange('tipo_comprobante', parseInt(value))}
            disabled={isLocked || isAnulado}
          >
            <SelectTrigger className="bg-white border divider-border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent className="bg-white border divider-border shadow-lg">
              {tiposComprobante.map((tipo) => (
                <SelectItem 
                  key={tipo.id} 
                  value={tipo.id.toString()}
                  className="hover:bg-gray-50"
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
            onChange={(e) => onInputChange('fecha_vencimiento', e.target.value)}
            className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            required
            disabled={isAnulado}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ComprobanteFormCard;

