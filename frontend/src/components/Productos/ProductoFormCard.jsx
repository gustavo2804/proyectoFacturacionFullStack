import { Card, CardContent, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { formatDisplayNumber } from "../../utils/numberFormatter";

/**
 * Card con el formulario del producto
 */
const ProductoFormCard = ({ producto, onInputChange }) => {
  // Calcular margen de ganancia
  const margenGanancia = producto.precio_venta - producto.precio_compra;
  const porcentajeGanancia = producto.precio_compra > 0 
    ? ((margenGanancia / producto.precio_compra) * 100).toFixed(1)
    : 0;

  return (
    <Card className="bg-white border rounded-xl divider-border shadow-md">
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
              onChange={(e) => onInputChange('codigo', e.target.value)}
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
              onChange={(e) => onInputChange('nombre', e.target.value)}
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
          <Textarea
            id="descripcion"
            value={producto.descripcion}
            onChange={(e) => onInputChange('descripcion', e.target.value)}
            placeholder="Descripción detallada del producto"
            rows={4}
            className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              onChange={(e) => onInputChange('precio_compra', parseFloat(e.target.value) || 0)}
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
              onChange={(e) => onInputChange('precio_venta', parseFloat(e.target.value) || 0)}
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
                  {formatDisplayNumber(margenGanancia)}
                </div>
                <div className="text-sm text-gray-500">
                  {porcentajeGanancia}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductoFormCard;

