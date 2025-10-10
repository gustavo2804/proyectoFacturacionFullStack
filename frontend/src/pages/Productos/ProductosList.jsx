import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductosApi from '../../services/productos.api'
import AdvancedTable from '../../components/AdvancedTable'
import { formatDisplayNumber } from '../../utils/numberFormatter'
import Toast from '../../components/ui/toast'

const ProductosList = () => {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
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
    const fetchProductos = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await ProductosApi.getAll()
        setProductos(data)
      } catch (error) {
        console.error('Error al cargar productos:', error)
        setError('Error al cargar los productos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductos()
  }, [])

  const dataFiltrada = productos.map(producto => ({
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio_compra: formatDisplayNumber(producto.precio_compra),
    precio_venta: formatDisplayNumber(producto.precio_venta),
    fecha_creacion: new Date(producto.fecha_creacion).toLocaleDateString('es-DO')
  }))

  const columns = [
    { key: 'codigo', label: 'Código', width: '15%', maxWidth: '120px' },
    { key: 'nombre', label: 'Nombre', width: '20%', maxWidth: '200px' },
    { key: 'descripcion', label: 'Descripción', width: '30%', maxWidth: '300px' },
    { key: 'precio_venta', label: 'Precio Venta', width: '15%', maxWidth: '120px' },
  ]

  // Funciones de manejo de acciones
  const handleDeleteProducto = async (rowId) => {
    try {
      await ProductosApi.delete(rowId)
      setProductos(productos.filter(producto => producto.id !== rowId))
      showToast('success', 'Producto eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      showToast('error', 'Error al eliminar el producto')
    }
  }

  const handleAddProducto = () => {
    navigate('/productos/nuevo')
  }

  const handleEditProducto = (rowId) => {
    navigate(`/productos/${rowId}`)
  }

  const handleViewProducto = (rowId) => {
    navigate(`/productos/${rowId}`)
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
          title="Productos"
          onDelete={handleDeleteProducto}
          onAdd={handleAddProducto}
          onEdit={handleEditProducto}
          onView={handleViewProducto}
          enableAdd={true}
          enableEdit={true}
          enableView={true}
          enableDelete={true}
          addButtonText="Nuevo Producto"
          searchPlaceholder="Buscar productos..."
          confirmDeleteMessage="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
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

export default ProductosList
