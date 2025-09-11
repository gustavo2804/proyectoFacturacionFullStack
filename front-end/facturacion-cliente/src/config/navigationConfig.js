// Configuración de navegación del sistema de facturación
export const navigationConfig = {
  menuItems: [
    { 
      name: 'Home', 
      href: '/home',
      icon: 'home'
    },
    { 
      name: 'Facturas', 
      href: '/facturas',
      icon: 'receipt',
      actions: [
        { name: "Ver Facturas", href: '/facturas', icon: 'list' },
        { name: "Nueva Factura", href: '/facturas/nueva', icon: 'plus' },
        { name: "Nueva Cotización", href: '/facturas/cotizacion', icon: 'document' },
        { name: "Reportes", href: '/facturas/reportes', icon: 'chart' }
      ]
    },
    { 
      name: 'Productos', 
      href: '/productos',
      icon: 'package',
      actions: [
        { name: "Ver Productos", href: '/productos', icon: 'list' },
        { name: "Nuevo Producto", href: '/productos/nuevo', icon: 'plus' },
        { name: "Categorías", href: '/productos/categorias', icon: 'tag' },
        { name: "Inventario", href: '/productos/inventario', icon: 'archive' }
      ]
    },
    { 
      name: 'Clientes', 
      href: '/clientes',
      icon: 'users',
      actions: [
        { name: "Ver Clientes", href: '/clientes/', icon: 'list' },
        { name: "Nuevo Cliente", href: '/clientes/nuevo', icon: 'plus' },
        { name: "Importar", href: '/clientes/importar', icon: 'upload' }
      ]
    },
    {
      name: 'Comprobantes',
      href: '/comprobantes',
      icon: 'document',
      actions: [
        { name: "Ver Series", href: '/comprobantes', icon: 'list' },
        { name: "Nueva Serie", href: '/comprobantes/nuevo', icon: 'plus' },
      ]
    },
    {
      name: 'Cotizaciones',
      href: '/cotizaciones',
      icon: 'file-text',
      actions: [
        { name: "Ver Cotizaciones", href: '/cotizaciones', icon: 'list' },
        { name: "Nueva Cotización", href: '/cotizaciones/nueva', icon: 'plus' },
        { name: "Reportes", href: '/cotizaciones/reportes', icon: 'chart' }
      ]
    }
  ]
};

// Configuración de permisos (opcional para futuro)
export const navigationPermissions = {
  'Facturas': ['create', 'read', 'update', 'delete'],
  'Productos': ['create', 'read', 'update', 'delete'],
  'Clientes': ['create', 'read', 'update']
};
