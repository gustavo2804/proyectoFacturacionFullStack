import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CotizacionesApi from '../../services/cotizaciones.api'
import ClientesApi from '../../services/clientes.api'
import AdvancedTable from '../../components/AdvancedTable'
import { formatDisplayNumber } from '../../utils/numberFormatter'
import Toast from '../../components/ui/toast'

const CotizacionesList = () => {
  const navigate = useNavigate()
  const [cotizaciones, setCotizaciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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
        
        // Cargar cotizaciones y clientes en paralelo
        const [cotizacionesData, clientesData] = await Promise.all([
          CotizacionesApi.getAll(),
          ClientesApi.getAll()
        ])
        
        setCotizaciones(cotizacionesData)
        setClientes(clientesData)
      } catch (error) {
        console.error('Error al cargar datos:', error)
        setError('Error al cargar las cotizaciones')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const dataFiltrada = cotizaciones.map(cotizacion => {
    // Buscar el cliente por ID
    const cliente = clientes.find(c => c.id === cotizacion.cliente)
    
    return {
      id: cotizacion.id,
      numero_cotizacion: cotizacion.numero_cotizacion,
      cliente: cliente ? cliente.nombre : 'Cliente no encontrado',
      fecha_emision: new Date(cotizacion.fecha_emision).toLocaleDateString('es-DO'),
      fecha_vencimiento: new Date(cotizacion.fecha_vencimiento).toLocaleDateString('es-DO'),
      estado: cotizacion.anulado ? 'Anulada' : 'Activa',
      total: formatDisplayNumber(cotizacion.total),
    }
  })

  const columns = [
    { key: 'numero_cotizacion', label: 'No. Cotización', width: '15%', maxWidth: '120px' },
    { key: 'cliente', label: 'Cliente', width: '25%', maxWidth: '200px' },
    { key: 'fecha_emision', label: 'Fecha Emisión', width: '15%', maxWidth: '120px' },
    { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', width: '15%', maxWidth: '120px' },
    { key: 'estado', label: 'Estado', width: '10%', maxWidth: '100px' },
    { key: 'total', label: 'Total', width: '10%', maxWidth: '100px' },
  ]

  // Funciones de manejo de acciones
  const handleDeleteCotizacion = async (rowId) => {
    try {
      await CotizacionesApi.delete(rowId)
      setCotizaciones(cotizaciones.filter(cotizacion => cotizacion.id !== rowId))
      showToast('success', 'Cotización eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar cotización:', error)
      showToast('error', 'Error al eliminar la cotización')
    }
  }

  const handleAddCotizacion = () => {
    navigate('/cotizaciones/nueva')
  }

  const handleEditCotizacion = (rowId) => {
    navigate(`/cotizaciones/${rowId}`)
  }

  const handleViewCotizacion = (rowId) => {
    navigate(`/cotizaciones/${rowId}`)
  }

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
          title="Cotizaciones"
          onDelete={handleDeleteCotizacion}
          onAdd={handleAddCotizacion}
          onEdit={handleEditCotizacion}
          onView={handleViewCotizacion}
          enableAdd={true}
          enableEdit={true}
          enableView={true}
          enableDelete={true}
          addButtonText="Nueva Cotización"
          searchPlaceholder="Buscar cotizaciones..."
          confirmDeleteMessage="¿Estás seguro de que deseas eliminar esta cotización? Esta acción no se puede deshacer."
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

export default CotizacionesList
