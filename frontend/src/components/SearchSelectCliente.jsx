import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Users, ChevronDown } from 'lucide-react';
import { Input } from './ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';

const SearchSelectCliente = ({ 
  value, 
  onChange, 
  clientes = [],
  placeholder = "Buscar y seleccionar cliente...",
  isDisabled = false,
  topLimit = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef(null);

  // Lógica de filtrado y top 10
  const clientesParaMostrar = useMemo(() => {
    let clientesFiltrados;
    
    if (!searchTerm.trim()) {
      // Sin búsqueda: mostrar top 10 (por orden de ID o nombre)
      clientesFiltrados = clientes
        .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
        .slice(0, topLimit);
    } else {
      // Con búsqueda: filtrar por nombre, documento o tipo
      clientesFiltrados = clientes.filter(cliente => 
        (cliente.nombre && cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cliente.numero_documento && String(cliente.numero_documento).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cliente.tipo_documento && cliente.tipo_documento.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return clientesFiltrados;
  }, [clientes, searchTerm, topLimit]);

  const clienteSeleccionado = clientes.find(c => c.id === value);

  // Recalcular posición cuando cambia el tamaño de ventana o scroll
  useEffect(() => {
    const calculatePosition = () => {
      if (inputRef.current && isOpen) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 2, // Solo 2px de separación
          left: rect.left,
          width: rect.width
        });
      }
    };

    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 2, // Solo 2px de separación
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      calculateDropdownPosition();
      setIsOpen(true);
    }
  };

  const handleFocus = () => {
    calculateDropdownPosition();
    setIsOpen(true);
  };

  const handleSelectChange = (selectedValue) => {
    const clienteId = selectedValue ? parseInt(selectedValue) : null;
    onChange(clienteId);
    setSearchTerm(''); // Limpiar búsqueda después de seleccionar
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-2">
      {/* Campo de búsqueda integrado */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={clienteSeleccionado ? `Cliente: ${clienteSeleccionado.nombre}` : placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            className="pl-10 pr-10 border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            disabled={isDisabled}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Dropdown de resultados */}
      {(isOpen || searchTerm) && (
        <div 
          className="fixed bg-white border divider-border shadow-lg rounded-md max-h-60 overflow-auto [[memory:7140669]]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999
          }}
        >
            {/* Header con información */}
            <div className="sticky top-0 bg-emerald-50 px-3 py-2 border-b text-xs text-emerald-700">
              {!searchTerm ? (
                `Top ${Math.min(topLimit, clientes.length)} clientes`
              ) : (
                `${clientesParaMostrar.length} resultado(s) para "${searchTerm}"`
              )}
            </div>
            
            {/* Lista de clientes */}
            <div className="py-1">
              {clientesParaMostrar.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  {searchTerm ? `No se encontraron clientes con "${searchTerm}"` : 'No hay clientes disponibles'}
                </div>
              ) : (
                clientesParaMostrar.map((cliente) => (
                  <div
                    key={cliente.id}
                    onClick={() => handleSelectChange(cliente.id.toString())}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 [[memory:7140669]] cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <Users className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-gray-900 truncate">{cliente.nombre}</span>
                      <span className="text-sm text-gray-500 truncate">
                        {cliente.tipo_documento}: {cliente.numero_documento || 'Sin documento'}
                      </span>
                    </div>
                    {cliente.id === value && (
                      <div className="h-2 w-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Footer con acción */}
            <div className="sticky bottom-0 bg-gray-50 px-3 py-2 border-t text-xs text-gray-600">
              {searchTerm ? 'Selecciona un cliente de los resultados' : 'Escribe para buscar más clientes'}
            </div>
        </div>
      )}
      
      {/* Click overlay para cerrar */}
      {(isOpen || searchTerm) && (
        <div 
          className="fixed inset-0"
          style={{ zIndex: 9998 }}
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};

export default SearchSelectCliente;
