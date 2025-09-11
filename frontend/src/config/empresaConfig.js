// Configuración de datos de la empresa para facturas y documentos
export const empresaConfig = {
  nombre: 'Tu Empresa',
  direccion: 'Calle Principal #123, Ciudad',
  rnc: '131-12345-6',
  telefono: '(809) 123-4567',
  email: 'contacto@tuempresa.com',
  web: 'www.tuempresa.com',
  
  // Configuración para la firma en PDFs
  firma: {
    nombre: 'Cristina Gallego',
    cargo: 'Gerente General'
  },
  
  // Colores corporativos (emerald - mismo que la aplicación)
  colores: {
    primary: '#059669', // emerald-600 (verde principal)
    secondary: '#10b981', // emerald-500 (verde secundario)
    accent: '#047857' // emerald-700 (verde oscuro)
  }
};

export default empresaConfig;
