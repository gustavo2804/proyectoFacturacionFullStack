import { 
  ClienteBasicInfo, 
  ClienteContactInfo, 
  ClienteFacturasHistory, 
  ClienteActivity 
} from "../ClienteInfoCard";

/**
 * Vista de solo lectura del cliente
 */
const ClienteViewContent = ({ cliente, onEdit }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Información básica */}
      <div className="lg:col-span-2">
        <ClienteBasicInfo 
          cliente={cliente} 
          onEdit={onEdit}
        />
      </div>
      
      {/* Información de contacto */}
      <ClienteContactInfo cliente={cliente} />
      
      {/* Historial de facturas */}
      <ClienteFacturasHistory cliente={cliente} />
      
      {/* Actividad reciente - full width */}
      <div className="lg:col-span-2">
        <ClienteActivity cliente={cliente} />
      </div>
    </div>
  );
};

export default ClienteViewContent;

