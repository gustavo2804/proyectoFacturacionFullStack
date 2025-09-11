import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Save, X } from "lucide-react";
import CustomSelect from "./CustomSelect";

const ClienteForm = ({ 
  cliente, 
  onChange, 
  onSave, 
  onCancel, 
  isEditing = false, 
  isSaving = false,
  variant = "full", // "full" or "quick"
  tiposComprobante = [] // Lista de tipos de comprobante del backend
}) => {
  // Opciones para tipo de documento
  const tiposDocumento = [
    { value: 'RNC', label: 'RNC' },
    { value: 'CEDULA', label: 'Cédula' },
    { value: 'PASAPORTE', label: 'Pasaporte' }
  ];

  const fields = [
    {
      key: 'nombre',
      label: 'Nombre',
      placeholder: 'Ingrese el nombre del cliente',
      required: true
    },
    {
      key: 'numero_documento',
      label: 'Número de Documento',
      placeholder: 'Ingrese el número de documento',
      required: true
    },
    {
      key: 'direccion',
      label: 'Dirección',
      placeholder: 'Ingrese la dirección del cliente',
      required: false
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      placeholder: 'Ingrese el número de teléfono',
      required: false
    },
    {
      key: 'email',
      label: 'Email',
      placeholder: 'Ingrese el correo electrónico',
      required: false,
      type: 'email'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (name, value) => {
    onChange(name, value);
  };

  const inputClassName = isEditing
    ? 'border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-700 placeholder:text-slate-500 hover:bg-slate-50 transition-colors'
    : 'bg-gray-50 text-gray-700';

  return (
    <div className="space-y-6">
      {/* ID field - only in full variant and only if exists */}
      
    
          <CustomSelect
            id="tipo_documento"
            label="Tipo de Documento"
            value={cliente.tipo_documento}
            onValueChange={(value) => handleSelectChange('tipo_documento', value)}
            options={tiposDocumento}
            placeholder="Seleccionar tipo de documento"
            disabled={!isEditing}
            required={true}
            isEditing={isEditing}
          />

     
          <CustomSelect
            id="tipo_ncf"
            label="Tipo de NCF"
            value={cliente.tipo_ncf ? cliente.tipo_ncf.toString() : ''}
            onValueChange={(value) => handleSelectChange('tipo_ncf', parseInt(value))}
            options={tiposComprobante}
            placeholder="Seleccionar tipo de NCF"
            disabled={!isEditing}
            required={true}
            valueKey="id"
            labelKey="tipo_comprobante"
            isEditing={isEditing}
          />
      
      {/* Dynamic fields */}
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
            {field.label} {field.required && '*'}
          </Label>
          <Input
            id={field.key}
            name={field.key}
            type={field.type || 'text'}
            value={cliente[field.key] || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={inputClassName}
            placeholder={field.placeholder}
          />
        </div>
      ))}

     

      {/* Action buttons - only when editing */}
      {isEditing && variant === "quick" && (
        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClienteForm;

