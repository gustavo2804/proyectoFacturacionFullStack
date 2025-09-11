import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Edit, Eye, Calendar, FileText, DollarSign, Phone, Mail, MapPin } from "lucide-react";

const ClienteInfoCard = ({ 
  title, 
  children, 
  icon: Icon, 
  onEdit, 
  isEditable = false,
  className = "" 
}) => {
  return (
    <Card className={`bg-white border rounded-xl divider-border shadow-md ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 text-emerald-600" />}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          {isEditable && onEdit && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="gap-2 rounded-md border-emerald-500 bg-white text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

// Componente específico para información básica
const ClienteBasicInfo = ({ cliente, onEdit, isEditing }) => (
  <ClienteInfoCard
    title="Información Básica"
    icon={Eye}
    onEdit={onEdit}
    isEditable={true}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-500">Nombre</label>
        <p className="text-gray-900 mt-1">{cliente.nombre || 'No especificado'}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">ID</label>
        <p className="text-gray-900 mt-1">#{cliente.id}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Tipo de Documento</label>
        <p className="text-gray-900 mt-1">{cliente.tipo_documento || 'No especificado'}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Número de Documento</label>
        <p className="text-gray-900 mt-1">{cliente.numero_documento || 'No especificado'}</p>
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-gray-500">Tipo de NCF</label>
        <p className="text-gray-900 mt-1">{cliente.tipo_ncf || 'No especificado'}</p>
      </div>
    </div>
  </ClienteInfoCard>
);

// Componente para información de contacto (placeholder)
const ClienteContactInfo = ({ cliente }) => (
  <ClienteInfoCard
    title="Información de Contacto"
    icon={Phone}
    isEditable={false}
  >
    <div className="text-gray-500 text-center py-8">
      <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
      <p>Información de contacto no disponible</p>
      <p className="text-xs mt-1">Esta sección se puede expandir en futuras versiones</p>
    </div>
  </ClienteInfoCard>
);

// Componente para historial de facturas (placeholder)
const ClienteFacturasHistory = ({ cliente }) => (
  <ClienteInfoCard
    title="Historial de Facturas"
    icon={FileText}
    isEditable={false}
  >
    <div className="text-gray-500 text-center py-8">
      <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
      <p>Historial de facturas no disponible</p>
      <p className="text-xs mt-1">Esta sección se puede expandir para mostrar facturas relacionadas</p>
    </div>
  </ClienteInfoCard>
);

// Componente para actividad reciente (placeholder)
const ClienteActivity = ({ cliente }) => (
  <ClienteInfoCard
    title="Actividad Reciente"
    icon={Calendar}
    isEditable={false}
  >
    <div className="text-gray-500 text-center py-8">
      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
      <p>Actividad reciente no disponible</p>
      <p className="text-xs mt-1">Esta sección puede mostrar últimas interacciones</p>
    </div>
  </ClienteInfoCard>
);

export default ClienteInfoCard;
export { ClienteBasicInfo, ClienteContactInfo, ClienteFacturasHistory, ClienteActivity };
