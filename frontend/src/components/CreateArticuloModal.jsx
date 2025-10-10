import { useState } from 'react';
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
import { X, Save, Plus } from 'lucide-react';
import ProductosApi from '../services/productos.api';
import Toast from './ui/toast';

const CreateArticuloModal = ({ isOpen, onClose, onArticuloCreated }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio_compra: '',
    precio_venta: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.precio_venta) {
      showToast('error', 'Nombre y precio de venta son obligatorios');
      return;
    }

    try {
      setIsLoading(true);
      
      const productData = {
        ...formData,
        precio_compra: parseFloat(formData.precio_compra) || 0,
        precio_venta: parseFloat(formData.precio_venta) || 0
      };

      const newProduct = await ProductosApi.create(productData);
      
      showToast('success', 'Artículo creado exitosamente');
      
      // Llamar callback para actualizar la lista
      if (onArticuloCreated) {
        onArticuloCreated(newProduct);
      }
      
      // Limpiar formulario y cerrar modal
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio_compra: '',
        precio_venta: ''
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error al crear artículo:', error);
      showToast('error', 'Error al crear el artículo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio_compra: '',
      precio_venta: ''
    });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] bg-white z-[10000] [&>div]:z-[10000] border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear Nuevo Artículo
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Código y Nombre */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-sm font-medium">
                    Código
                  </Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    placeholder="Código único"
                    className="border-gray-200 focus:border-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-medium">
                    Nombre del Artículo *
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ingrese el nombre del artículo"
                    className="border-gray-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-medium">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Descripción del artículo"
                  rows={3}
                  className="border-gray-200 focus:border-emerald-500"
                />
              </div>

              {/* Precio de compra y venta */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio_compra" className="text-sm font-medium">
                    Precio de Compra
                  </Label>
                  <Input
                    id="precio_compra"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio_compra}
                    onChange={(e) => handleInputChange('precio_compra', e.target.value)}
                    placeholder="0.00"
                    className="border-gray-200 focus:border-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="precio_venta" className="text-sm font-medium">
                    Precio de Venta *
                  </Label>
                  <Input
                    id="precio_venta"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio_venta}
                    onChange={(e) => handleInputChange('precio_venta', e.target.value)}
                    placeholder="0.00"
                    className="border-gray-200 focus:border-emerald-500"
                    required
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
                {isLoading ? 'Creando...' : 'Crear Artículo'}
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

export default CreateArticuloModal;
