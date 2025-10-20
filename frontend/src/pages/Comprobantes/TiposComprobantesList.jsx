import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvancedTable from '../../components/AdvancedTable'
import Toast from '../../components/ui/toast'
import { TipoComprobantesApi } from '../../services/comprobantes.api'

const TiposComprobantesList = () => {
  const navigate = useNavigate()
  const [tiposComprobantes, setTiposComprobantes] = useState([])
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' })

  useEffect(() => {
    fetchTiposComprobantes()
  }, [])

  const fetchTiposComprobantes = async () => {
    try {
      const data = await TipoComprobantesApi.getAll()
      setTiposComprobantes(data)
    } catch (error) {
      console.error('Error al cargar tipos de comprobantes:', error)
      showToast('error', 'Error al cargar los tipos de comprobantes')
    }
  }

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleDelete = async (rowId) => {
    try {
      await TipoComprobantesApi.delete(rowId)
      setTiposComprobantes(tiposComprobantes.filter(tipo => tipo.id !== rowId))
      showToast('success', 'Tipo de comprobante eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar tipo de comprobante:', error)
      showToast('error', 'Error al eliminar el tipo de comprobante')
    }
  }

  const handleAdd = () => {
    navigate('/comprobantes/tipos/nuevo')
  }

  const handleEdit = (rowId) => {
    navigate(`/comprobantes/tipos/${rowId}`)
  }

  const handleView = (rowId) => {
    navigate(`/comprobantes/tipos/${rowId}`)
  }

  const dataFiltrada = tiposComprobantes.map(tipo => ({
    id: tipo.id,
    tipo_comprobante: tipo.tipo_comprobante,
    descripcion: tipo.descripcion,
  }))

  const columns = [
    { key: 'tipo_comprobante', label: 'Tipo de Comprobante', width: '30%', maxWidth: '200px' },
    { key: 'descripcion', label: 'Descripción', width: '70%', maxWidth: '500px' },
  ]

  return (
    <div className='w-full px-8'>
        <AdvancedTable 
          data={dataFiltrada} 
          columns={columns} 
          title="Tipos de Comprobantes"
          onDelete={handleDelete}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleView}
          enableAdd={true}
          enableEdit={true}
          enableView={true}
          enableDelete={true}
          addButtonText="Nuevo Tipo"
          searchPlaceholder="Buscar tipos de comprobantes..."
          confirmDeleteMessage="¿Estás seguro de que deseas eliminar este tipo de comprobante? Esta acción no se puede deshacer."
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

export default TiposComprobantesList;
