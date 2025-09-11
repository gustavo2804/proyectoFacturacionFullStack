import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FacturasApi, { ProductosApi, DetalleFacturaApi } from '../../services/facturas.api'
import ClientesApi from '../../services/clientes.api'
import { TipoComprobantesApi } from '../../services/comprobantes.api'
import AdvancedTable from '../../components/AdvancedTable'
import { generateFacturaPDF } from '../../utils/pdfGenerator'
import { Button } from '../../components/ui/button'
import { FileText } from 'lucide-react'
import Toast from '../../components/ui/toast'
import { ESTADOS_FACTURA } from '../../config/facturaConfig'

const FacturasList = () => {
  const navigate = useNavigate()

  const [facturas, setFacturas] = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [tiposComprobante, setTiposComprobante] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(null) // ID de la factura para la cual se está generando PDF
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' })

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Cargar facturas, clientes, productos y tipos de comprobante en paralelo
        const [facturasData, clientesData, productosData, tiposComprobanteData] = await Promise.all([
          FacturasApi.getAll(),
          ClientesApi.getAll(),
          ProductosApi.getAll(),
          TipoComprobantesApi.getAll()
        ])
        
        setFacturas(facturasData)
        setClientes(clientesData)
        setProductos(productosData)
        setTiposComprobante(tiposComprobanteData)
      } catch (error) {
        console.error('Error al cargar datos:', error)
        setError('Error al cargar los datos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Función para generar PDF de una factura específica
  const handleGeneratePDF = async (facturaId) => {
    try {
      setIsGeneratingPDF(facturaId)
      setError(null)

      // Buscar la factura
      const factura = facturas.find(f => f.id === facturaId)
      if (!factura) {
        setError('Factura no encontrada')
        return
      }

      // Buscar el cliente
      const clienteId = factura.cliente?.id || factura.cliente
      const cliente = clientes.find(c => c.id === clienteId)
      if (!cliente) {
        setError('Cliente no encontrado para esta factura')
        return
      }

      // Obtener detalles reales de la factura
      console.log('Obteniendo detalles para factura ID:', facturaId)
      const detallesData = await DetalleFacturaApi.getByFacturaId(facturaId)
      console.log('Detalles obtenidos:', detallesData)
      const detalles = detallesData.map(detalle => ({
        ...detalle,
        producto: detalle.producto?.id || detalle.producto
      }))
      console.log('Detalles procesados:', detalles)

      // Generar el PDF
      generateFacturaPDF(factura, cliente, detalles, productos)
      
    } catch (error) {
      console.error('Error al generar PDF:', error)
      setError('Error al generar el PDF de la factura')
    } finally {
      setIsGeneratingPDF(null)
    }
  }

  // Funciones de manejo de acciones
  const handleDeleteFactura = async (rowId) => {
    try {
      await FacturasApi.delete(rowId)
      setFacturas(facturas.filter(factura => factura.id !== rowId))
      showToast('success', 'Factura eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar factura:', error)
      showToast('error', 'Error al eliminar la factura')
    }
  }

  const handleAddFactura = () => {
    navigate('/facturas/nueva')
  }

  const handleEditFactura = (rowId) => {
    navigate(`/facturas/${rowId}`)
  }

  const handleViewFactura = (rowId) => {
    console.log('handleViewFactura called with rowId:', rowId)
    console.log('Navigating to:', `/facturas/${rowId}`)
    navigate(`/facturas/${rowId}`)
  }

  const dataFiltrada = facturas.map(factura => {
    // Buscar el cliente por ID
    const clienteId = factura.cliente?.id || factura.cliente
    const cliente = clientes.find(c => c.id === clienteId)
    
    // Buscar el tipo de comprobante por ID
    const tipoComprobanteId = factura.tipo_comprobante?.id || factura.tipo_comprobante
    const tipoComprobante = tiposComprobante.find(t => t.id === tipoComprobanteId)
    
    return {
      id: factura.id,
      numero_factura: factura.numero_factura,
      cliente: cliente?.nombre || 'Sin cliente',
      fecha_emision: new Date(factura.fecha_emision).toLocaleDateString('es-DO'),
      estado: factura.estado,
      total: `$${parseFloat(factura.total).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`,
      tipo_comprobante: tipoComprobante?.descripcion || 'N/A'
    }
  })

  const columns = [
    { key: 'numero_factura', label: 'No. Factura', width: '10%', maxWidth: '120px' },
    { key: 'cliente', label: 'Cliente', width: '18%', maxWidth: '100px' },
    { key: 'fecha_emision', label: 'Fecha Emisión', width: '12%', maxWidth: '120px' },
    { key: 'estado', label: 'Estado', width: '12%', maxWidth: '100px' },
    { key: 'tipo_comprobante', label: 'Tipo Comprobante', width: '18%', maxWidth: '120px' },
    { key: 'total', label: 'Total', width: '12%', maxWidth: '100px' }
  ]

  if (isLoading) {
    return (
      <div className='w-full px-8'>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-full px-8'>
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full px-8'>
        <AdvancedTable 
          data={dataFiltrada} 
          columns={columns} 
          title="Facturas"
          onDelete={handleDeleteFactura}
          onAdd={handleAddFactura}
          onEdit={handleEditFactura}
          onView={handleViewFactura}
          enableAdd={true}
          enableEdit={true}
          enableView={true}
          enableDelete={true}
          addButtonText="Nueva Factura"
          searchPlaceholder="Buscar facturas..."
          confirmDeleteMessage="¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer."
        />
        
        {/* Toast notifications */}
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
    </div>
  )
}

export default FacturasList
