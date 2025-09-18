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

      ]
    },
    { 
      name: 'Productos', 
      href: '/productos',
      icon: 'package',
      actions: [
       
      ]
    },
    { 
      name: 'Clientes', 
      href: '/clientes',
      icon: 'users',
      actions: [
      ]
    },
    {
      name: 'Comprobantes',
      href: '/comprobantes',
      icon: 'document',
      actions: [
      ]
    },
    {
      name: 'Cotizaciones',
      href: '/cotizaciones',
      icon: 'file-text',
      actions: [
    
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
