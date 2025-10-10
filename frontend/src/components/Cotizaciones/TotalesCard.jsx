import { Card, CardContent } from "../ui/card";
import ItbisSelect from "../ItbisSelect";
import { formatDisplayNumber } from "../../utils/numberFormatter";

/**
 * Card con los totales de la cotización/factura
 */
const TotalesCard = ({ totales, itbisRate, onItbisRateChange, disabled = false }) => {
  return (
    <Card className="bg-white border rounded-xl divider-border shadow-md">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          {/* Selector de ITBIS */}
          <div className="w-64">
            <ItbisSelect
              value={itbisRate}
              onChange={onItbisRateChange}
              label="Tasa de ITBIS"
              disabled={disabled}
            />
          </div>
          
          {/* Totales */}
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatDisplayNumber(totales.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>ITBIS ({totales.itbisPercentage}%):</span>
              <span>{formatDisplayNumber(totales.itbis)}</span>
            </div>
            <div className="border-t divider-border pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatDisplayNumber(totales.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalesCard;

