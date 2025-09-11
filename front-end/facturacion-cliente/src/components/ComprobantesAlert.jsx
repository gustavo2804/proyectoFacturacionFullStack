import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { SerieComprobantesApi } from '@/services/comprobantes.api';

const ComprobantesAlert = () => {
  const [alertas, setAlertas] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        setIsLoading(true);
        const data = await SerieComprobantesApi.getAlertas(5);
        setAlertas(data);
      } catch (error) {
        console.error('Error al cargar alertas de comprobantes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertas();
  }, []);

  if (isLoading || !isVisible || alertas.length === 0) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-orange-50 border border-orange-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800">
                Alertas de Comprobantes
              </h3>
              <div className="mt-2 space-y-2">
                {alertas.map((alerta) => (
                  <div key={alerta.id} className="text-sm">
                    <p className="text-orange-700">
                      <span className="font-medium">{alerta.tipo_comprobante}</span>
                      {alerta.esta_agotado ? (
                        <span className="text-red-600 font-semibold"> - AGOTADO</span>
                      ) : (
                        <span className="text-orange-600">
                          {' '} - Quedan {alerta.comprobantes_restantes} comprobantes
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-orange-600">
                      Rango: {alerta.desde} - {alerta.hasta} | Actual: {alerta.numero_actual}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-orange-400 hover:text-orange-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprobantesAlert;
