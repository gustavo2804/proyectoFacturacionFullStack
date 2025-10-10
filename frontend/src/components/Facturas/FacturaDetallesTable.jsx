import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import SearchSelectProducto from "@/components/SearchSelectProducto";
import { formatDisplayNumber } from "@/utils/numberFormatter";

/**
 * Tabla de detalles/artículos de la factura
 */
const FacturaDetallesTable = ({
  detalles,
  productos,
  isLoading,
  isFacturaEditable,
  onAddDetalle,
  onDetalleChange,
  onRemoveDetalle,
  onProductoSelect,
  onCrearArticulo
}) => {
  return (
    <Card className="bg-white border rounded-xl divider-border shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Artículos</h2>
        <Button
          onClick={onAddDetalle}
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
              <TableHead>Descripción</TableHead>
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
                    onChange={(value) => onProductoSelect(index, value)}
                    productos={productos}
                    placeholder="Buscar y seleccionar producto..."
                    isDisabled={isLoading || !isFacturaEditable}
                    topLimit={10}
                    onProductoSelect={(producto) => {
                      onDetalleChange(index, 'precio_unitario', producto.precio || '');
                      // Solo llenar la descripción si está vacía
                      if (!detalle.descripcion) {
                        onDetalleChange(index, 'descripcion', producto.descripcion || '');
                      }
                    }}
                    onCrearArticulo={onCrearArticulo}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={detalle.descripcion || ''}
                    onChange={(e) => onDetalleChange(index, 'descripcion', e.target.value)}
                    placeholder="Descripción del producto..."
                    disabled={!isFacturaEditable}
                    className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={detalle.cantidad}
                    onChange={(e) => onDetalleChange(index, 'cantidad', parseInt(e.target.value) || '')}
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
                    onChange={(e) => onDetalleChange(index, 'precio_unitario', parseFloat(e.target.value) || '')}
                    disabled={!isFacturaEditable}
                    className="border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {formatDisplayNumber(detalle.subtotal)}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => onRemoveDetalle(index)}
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
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No hay artículos agregados. Haz clic en "Agregar Artículo" para comenzar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FacturaDetallesTable;

