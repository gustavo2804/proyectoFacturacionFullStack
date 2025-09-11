import jsPDF from 'jspdf';
import { empresaConfig } from '../config/empresaConfig';

// Configuración de fuentes y estilos - Usando colores emerald de la aplicación
const COLORS = {
  primary: '#059669', // emerald-600 (verde principal de la app)
  secondary: '#10b981', // emerald-500 (verde secundario)
  accent: '#047857', // emerald-700 (verde más oscuro)
  dark: '#1e293b', // slate-800
  light: '#f0fdf4', // green-50 (fondo verde claro)
  white: '#ffffff',
  text: '#334155', // slate-700
  border: '#d1d5db', // gray-300
  tableHeader: '#059669' // emerald-600 para headers de tabla
};

const FONTS = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold'
};

export const generateFacturaPDF = (factura, cliente, detalles, productos) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let currentY = 0;

  // Función auxiliar para agregar texto
  const addText = (text, x, y, options = {}) => {
    const { 
      fontSize = 10, 
      fontStyle = 'normal', 
      align = 'left',
      color = COLORS.dark,
      maxWidth = null
    } = options;
    
    doc.setFontSize(fontSize);
    doc.setFont(FONTS.regular, fontStyle);
    doc.setTextColor(color);
    
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y, { align });
      return y + (lines.length * fontSize * 0.35);
    } else {
      doc.text(text, x, y, { align });
      return y + (fontSize * 0.35);
    }
  };

  // Función auxiliar para agregar línea
  const addLine = (x1, y1, x2, y2, color = COLORS.border) => {
    doc.setDrawColor(color);
    doc.line(x1, y1, x2, y2);
  };

  // Función auxiliar para agregar rectángulo
  const addRect = (x, y, width, height, fillColor = null, strokeColor = COLORS.border) => {
    doc.setDrawColor(strokeColor);
    if (fillColor) {
      doc.setFillColor(fillColor);
      doc.rect(x, y, width, height, 'FD');
    } else {
      doc.rect(x, y, width, height);
    }
  };

  // ESPACIO PARA LOGO DE LA EMPRESA (sin franja verde)
  const logoX = 20;
  const logoY = 20;
  const logoWidth = 80;
  const logoHeight = 40;
  
  // Marco visual para el logo (opcional - se puede quitar cuando se agregue el logo real)
  doc.setDrawColor(COLORS.border);
  doc.setLineWidth(1);
  doc.rect(logoX, logoY, logoWidth, logoHeight);
  
  // Placeholder text para el logo
  addText('LOGO', logoX + logoWidth/2, logoY + logoHeight/2, {
    fontSize: 10,
    align: 'center',
    color: COLORS.text
  });
  
  // Título de la empresa al lado derecho
  currentY = 40;
  addText('SISTEMA DE FACTURACIÓN', pageWidth - 60, currentY, {
    fontSize: 16,
    fontStyle: 'bold',
    align: 'center',
    color: COLORS.text
  });
  
  currentY = logoY + logoHeight + 30;

  // SECCIÓN DE DATOS EN DOS COLUMNAS - MEJOR ALINEACIÓN
  const leftColX = 20;
  const rightColX = pageWidth / 2 + 10;
  const colWidth = (pageWidth / 2) - 25;
  const startY = currentY;

  // DATOS DEL CLIENTE (Izquierda)
  addText('DATOS DEL CLIENTE', leftColX, currentY, {
    fontSize: 12,
    fontStyle: 'bold',
    color: COLORS.text
  });
  
  currentY += 8;
  addText(`Nombre: ${cliente?.nombre || 'N/A'}`, leftColX, currentY, {
    fontSize: 10,
    color: COLORS.text
  });
  
  currentY += 6;
  addText(`Dirección: ${cliente?.direccion || 'No especificada'}`, leftColX, currentY, {
    fontSize: 10,
    color: COLORS.text,
    maxWidth: colWidth
  });
  
  currentY += 6;
  addText(`RNC: ${cliente?.numero_documento || 'N/A'}`, leftColX, currentY, {
    fontSize: 10,
    color: COLORS.text
  });
  
  currentY += 6;
  addText(`Teléfono: ${cliente?.telefono || 'N/A'}`, leftColX, currentY, {
    fontSize: 10,
    color: COLORS.text
  });

  // DATOS DE LA EMPRESA (Derecha) - ALINEADOS CON LOS DATOS DEL CLIENTE
  currentY = startY; // Reset para alinear con datos del cliente
  
  addText('DATOS DE LA EMPRESA', rightColX, currentY, {
    fontSize: 12,
    fontStyle: 'bold',
    color: COLORS.text
  });
  
  currentY += 8;
  addText(`Nombre: ${empresaConfig.nombre}`, rightColX, currentY, {
    fontSize: 10,
    color: COLORS.text
  });
  
  currentY += 6;
  addText(`Dirección: ${empresaConfig.direccion}`, rightColX, currentY, {
    fontSize: 10,
    color: COLORS.text,
    maxWidth: colWidth
  });
  
  currentY += 6;
  addText(`RNC: ${empresaConfig.rnc}`, rightColX, currentY, {
    fontSize: 10,
    color: COLORS.text
  });
  
  currentY += 6;
  addText(`Teléfono: ${empresaConfig.telefono}`, rightColX, currentY, {
    fontSize: 10,
    color: COLORS.text
  });

  currentY += 15;

  // FECHA Y NÚMERO DE FACTURA
  addText(`Fecha: ${new Date(factura.fecha_emision).toLocaleDateString('es-DO')}`, leftColX, currentY, {
    fontSize: 11,
    fontStyle: 'bold',
    color: COLORS.text
  });
  
  currentY += 6;
  addText(`Factura No: ${factura.numero_factura || 'N/A'}`, leftColX, currentY, {
    fontSize: 11,
    fontStyle: 'bold',
    color: COLORS.text
  });
  
  // NCF ASIGNADO (si existe)
  if (factura.ncf_asignado && factura.ncf_asignado.numero_comprobante_completo) {
    currentY += 6;
    addText(`NCF: ${factura.ncf_asignado.numero_comprobante_completo}`, leftColX, currentY, {
      fontSize: 11,
      fontStyle: 'bold',
      color: COLORS.text
    });
  }

  currentY += 15;

  // TABLA DE PRODUCTOS - MEJORADA CON PESOS DOMINICANOS Y MARGEN DERECHO
  const tableHeaders = ['Concepto', 'Cantidad', 'Precio Unit.', 'Total'];
  const columnWidths = [85, 25, 35, 30]; // Ajustado para dejar más margen derecho
  const tableStartX = 20;
  const rightMargin = 50; // Margen derecho aumentado
  const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
  let tableX = tableStartX;

  // Header de la tabla con fondo verde
  doc.setFillColor(COLORS.tableHeader);
  doc.rect(tableStartX, currentY, tableWidth, 12, 'F');
  
  tableHeaders.forEach((header, index) => {
    addText(header, tableX + 2, currentY + 7, {
      fontSize: 10,
      fontStyle: 'bold',
      color: COLORS.white
    });
    
    // Líneas divisorias verticales en blanco
    if (index < tableHeaders.length - 1) {
      doc.setDrawColor(COLORS.white);
      doc.line(tableX + columnWidths[index], currentY, tableX + columnWidths[index], currentY + 12);
    }
    
    tableX += columnWidths[index];
  });

  currentY += 12;

  // Filas de productos con alternancia de colores
  let subtotalGeneral = 0;
  
  detalles.forEach((detalle, index) => {
    const producto = productos.find(p => p.id === parseInt(detalle.producto));
    const subtotalProducto = parseFloat(detalle.subtotal) || (parseFloat(detalle.cantidad) * parseFloat(detalle.precio_unitario));
    subtotalGeneral += subtotalProducto;
    
    // Fondo alternado para filas con verde muy claro
    if (index % 2 === 0) {
      doc.setFillColor(COLORS.light); // Verde muy claro para alternar filas
      doc.rect(tableStartX, currentY, tableWidth, 10, 'F');
    }
    
    tableX = tableStartX;
    
    // Concepto/Producto
    addText(producto?.nombre || 'Producto no encontrado', tableX + 2, currentY + 6, {
      fontSize: 9,
      color: COLORS.text,
      maxWidth: columnWidths[0] - 4,
      align: 'left'
    });
    
    // Cantidad
    tableX += columnWidths[0];
    addText(detalle.cantidad.toString(), tableX + 2, currentY + 6, {
      fontSize: 9,
      color: COLORS.text,
      align: 'left'
    });
    
    // Precio unitario
    tableX += columnWidths[1];
    addText(`RD$ ${parseFloat(detalle.precio_unitario).toFixed(2)}`, tableX + 2, currentY + 6, {
      fontSize: 9,
      color: COLORS.text,
      align: 'left'
    });
    
    // Total
    tableX += columnWidths[2];
    addText(`RD$ ${subtotalProducto.toFixed(2)}`, tableX + 2, currentY + 6, {
      fontSize: 9,
      color: COLORS.text,
      align: 'left'
    });
    
    currentY += 10;
  });

  // Línea final de la tabla
  doc.setDrawColor(COLORS.border);
  doc.line(tableStartX, currentY, tableStartX + tableWidth, currentY);
  currentY += 15;

  // INFORMACIÓN ADICIONAL
  if (detalles.length > 0) {
    addText('Forma de pago: Transferencia', tableStartX, currentY, {
      fontSize: 9,
      color: COLORS.text
    });
    
    currentY += 6;
    addText('Nota: El servicio tiene una validez de 30 días', tableStartX, currentY, {
      fontSize: 9,
      color: COLORS.text
    });
    
    currentY += 15;
  }

  // TOTALES - MEJORADOS CON PESOS DOMINICANOS (lado derecho, alineados con margen de tabla)
  const totalsX = pageWidth - 90;
  const totalsWidth = 80;
  
  const itbis = subtotalGeneral * 0.18; // ITBIS 18% (tasa dominicana)
  const total = subtotalGeneral + itbis;
  
  // Fila Subtotal
  addText('Subtotal:', totalsX, currentY, {
    fontSize: 11,
    color: COLORS.text
  });
  addText(`RD$ ${subtotalGeneral.toFixed(2)}`, totalsX + totalsWidth - 5, currentY, {
    fontSize: 11,
    color: COLORS.text,
    align: 'right'
  });
  
  currentY += 7;
  
  // Fila ITBIS
  addText('ITBIS 18%:', totalsX, currentY, {
    fontSize: 11,
    color: COLORS.text
  });
  addText(`RD$ ${itbis.toFixed(2)}`, totalsX + totalsWidth - 5, currentY, {
    fontSize: 11,
    color: COLORS.text,
    align: 'right'
  });
  
  currentY += 10;
  
  // Línea separadora
  doc.setDrawColor(COLORS.border);
  doc.line(totalsX, currentY, totalsX + totalsWidth, currentY);
  currentY += 5;
  
  // Total con fondo verde - ALINEADO CON LA LÍNEA GRIS
  doc.setFillColor(COLORS.primary);
  doc.rect(totalsX, currentY - 3, totalsWidth, 15, 'F');
  
  addText('TOTAL:', totalsX + 5, currentY + 4, {
    fontSize: 14,
    fontStyle: 'bold',
    color: COLORS.white
  });
  addText(`RD$ ${total.toFixed(2)}`, totalsX + totalsWidth - 5, currentY + 4, {
    fontSize: 14,
    fontStyle: 'bold',
    color: COLORS.white,
    align: 'right'
  });

  // FIRMA ELIMINADA - No se necesita
  
  // FOOTER SIMPLE (sin franja verde)
  const footerY = pageHeight - 30;
  
  // Texto del footer
  addText(`Generado el: ${new Date().toLocaleDateString('es-DO')}`, pageWidth / 2, footerY, {
    fontSize: 8,
    align: 'center',
    color: COLORS.text
  });

  // Guardar el PDF
  const fileName = `Factura_${factura.numero_factura}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
};

export default generateFacturaPDF;
