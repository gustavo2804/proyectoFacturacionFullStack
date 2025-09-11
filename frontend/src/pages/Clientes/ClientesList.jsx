import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientesApi from '../../services/clientes.api'
import AdvancedTable from '../../components/AdvancedTable'
import Toast from '../../components/ui/toast'

const Clientes = () => {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' })

  useEffect(() => {
    ClientesApi.getAll()
    .then(setClientes)
    .catch(console.error)
  }, [])

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleDelete = (rowId) => {
    console.log('Eliminar cliente:', rowId)
    ClientesApi.delete(rowId)
    .then(() => {
      setClientes(clientes.filter(cliente => cliente.id !== rowId))
      showToast('success', 'Cliente eliminado exitosamente')
    })
    .catch((error) => {
      console.error('Error al eliminar cliente:', error)
      showToast('error', 'Error al eliminar el cliente')
    })
  }

  const handleAdd = () => {
    navigate('/clientes/nuevo')
  }

  const handleEdit = (rowId) => {
    navigate(`/clientes/${rowId}`)
  }

  const handleView = (rowId) => {
    navigate(`/clientes/${rowId}`)
  }
  const dataFiltrada = clientes.map(cliente => ({
    id: cliente.id,
    nombre: cliente.nombre,
    tipo_documento: cliente.tipo_documento,
    numero_documento: cliente.numero_documento,
    tipo_ncf: cliente.tipo_ncf,
  }))

  const columns = [
    { key: 'nombre', label: 'Nombre', width: '25%', maxWidth: '200px' },
    { key: 'tipo_documento', label: 'Tipo de Documento', width: '20%', maxWidth: '150px' },
    { key: 'numero_documento', label: 'Número de Documento', width: '20%', maxWidth: '150px' },
    { key: 'tipo_ncf', label: 'Tipo de NCF', width: '15%', maxWidth: '120px' },
  ]

  return (
    <div className='w-full px-8'>
        <AdvancedTable 
          data={dataFiltrada} 
          columns={columns} 
          title="Clientes"
          onDelete={handleDelete}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleView}
          enableAdd={true}
          enableEdit={true}
          enableView={true}
          enableDelete={true}
          addButtonText="Nuevo Cliente"
          searchPlaceholder="Buscar clientes..."
          confirmDeleteMessage="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
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

export default Clientes