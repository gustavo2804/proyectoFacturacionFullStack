import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { X, Save, Plus } from 'lucide-react';
import ClientesApi from '../services/clientes.api';
import { TipoComprobantesApi } from '../services/comprobantes.api';
import Toast from './ui/toast';

const CreateClienteModal = ({ isOpen, onClose, onClienteCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_documento: '1',
    numero_documento: '',
    tipo_ncf: '1',
    direccion: '',
    telefono: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });
  const [tiposNCF, setTiposNCF] = useState([]);
  const [loadingTiposNCF, setLoadingTiposNCF] = useState(false);

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Cargar tipos de NCF al abrir el modal
  useEffect(() => {
    const loadTiposNCF = async () => {
      if (isOpen && tiposNCF.length === 0) {
        try {
          setLoadingTiposNCF(true);
          const tipos = await TipoComprobantesApi.getAll();
          setTiposNCF(tipos);
          
          // Si no hay tipos cargados, establecer el primero como predeterminado
          if (tipos.length > 0 && formData.tipo_ncf === '1') {
            setFormData(prev => ({
              ...prev,
              tipo_ncf: tipos[0].id.toString()
            }));
          }
        } catch (error) {
          console.error('Error al cargar tipos de NCF:', error);
          showToast('error', 'Error al cargar tipos de NCF');
        } finally {
          setLoadingTiposNCF(false);
        }
      }
    };

    loadTiposNCF();
  }, [isOpen, tiposNCF.length]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.numero_documento) {
      showToast('error', 'Nombre y número de documento son obligatorios');
      return;
    }

    try {
      setIsLoading(true);
      
      const clienteData = {
        ...formData,
        numero_documento: parseInt(formData.numero_documento),
        tipo_documento: formData.tipo_documento,
        tipo_ncf: parseInt(formData.tipo_ncf),
        direccion: formData.direccion || null,
        telefono: formData.telefono || null,
        email: formData.email || null
      };

      const newCliente = await ClientesApi.create(clienteData);
      
      showToast('success', 'Cliente creado exitosamente');
      
      // Llamar callback para actualizar la lista
      if (onClienteCreated) {
        onClienteCreated(newCliente);
      }
      
      // Limpiar formulario y cerrar modal
      setFormData({
        nombre: '',
        tipo_documento: '1',
        numero_documento: '',
        tipo_ncf: '1',
        direccion: '',
        telefono: '',
        email: ''
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error al crear cliente:', error);
      showToast('error', 'Error al crear el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      tipo_documento: '1',
      numero_documento: '',
      tipo_ncf: '1',
      direccion: '',
      telefono: '',
      email: ''
    });
    onClose();
  };

  const tiposDocumento = [
    { value: '1', label: 'Cédula' },
    { value: '2', label: 'Pasaporte' },
    { value: '3', label: 'RNC' }
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] bg-white z-[10000] [&>div]:z-[10000] border-gray-200 [&_[data-radix-select-content]]:z-[10001] [&_[data-radix-select-viewport]]:z-[10001]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear Nuevo Cliente
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Nombre y Tipo de Documento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-medium">
                    Nombre del Cliente *
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ingrese el nombre del cliente"
                    className="border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo_documento" className="text-sm font-medium">
                    Tipo de Documento
                  </Label>
                  <Select 
                    value={formData.tipo_documento} 
                    onValueChange={(value) => handleInputChange('tipo_documento', value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-emerald-500 bg-white">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="z-[10001] bg-white border-gray-200" sideOffset={4} position="popper">
                      {tiposDocumento.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value} className="hover:bg-emerald-50 focus:bg-emerald-50">
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Número de Documento y Tipo NCF */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_documento" className="text-sm font-medium">
                    Número de Documento *
                  </Label>
                  <Input
                    id="numero_documento"
                    type="number"
                    value={formData.numero_documento}
                    onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                    placeholder="Ej: 12345678901"
                    className="border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo_ncf" className="text-sm font-medium">
                    Tipo NCF
                  </Label>
                  <Select 
                    value={formData.tipo_ncf} 
                    onValueChange={(value) => handleInputChange('tipo_ncf', value)}
                    disabled={loadingTiposNCF}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-emerald-500 bg-white">
                      <SelectValue placeholder={loadingTiposNCF ? "Cargando tipos..." : "Seleccionar tipo NCF"} />
                    </SelectTrigger>
                    <SelectContent className="z-[10001] bg-white border-gray-200" sideOffset={4} position="popper">
                      {tiposNCF.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()} className="hover:bg-emerald-50 focus:bg-emerald-50">
                          {tipo.tipo_comprobante} - {tipo.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccion" className="text-sm font-medium">
                  Dirección
                </Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Dirección del cliente"
                  rows={2}
                  className="border-gray-200 focus:border-emerald-500"
                />
              </div>

              {/* Teléfono y Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm font-medium">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="Ej: 809-123-4567"
                    className="border-gray-200 focus:border-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="cliente@ejemplo.com"
                    className="border-gray-200 focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Creando...' : 'Crear Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default CreateClienteModal;
