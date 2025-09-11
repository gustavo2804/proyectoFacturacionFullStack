import { useEffect, useState } from 'react'
import { SerieComprobantesApi } from '../../services/comprobantes.api'
import AdvancedTable from '../../components/AdvancedTable'

const ComprobantesList = () => {

  const [seriesComprobante, setSeriesComprobante] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await SerieComprobantesApi.getAll()
        setSeriesComprobante(data)
      } catch (error) {
        console.error('Error al cargar series de comprobante:', error)
        setError('Error al cargar las series de comprobante')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeries()
  }, [])

  const dataFiltrada = seriesComprobante.map(serie => {
    const restantes = serie.hasta && serie.desde ? Math.max(0, serie.hasta - serie.numero_actual) : 0;
    const estaPorAgotarse = restantes <= 5 && restantes > 0;
    const estaAgotado = restantes === 0;
    
    // El tipo de comprobante ahora viene como objeto completo desde el serializer
    const tipoComprobante = serie.tipo_comprobante;
    const tipoComprobanteTexto = tipoComprobante 
      ? `${tipoComprobante.tipo_comprobante} - ${tipoComprobante.descripcion}`
      : 'Sin tipo';
    
    return {
      id: serie.id,
      rango: `${serie.desde || 'N/A'} - ${serie.hasta || 'N/A'}`,
      tipo_comprobante: tipoComprobanteTexto,
      numero_actual: serie.numero_actual,
      restantes: restantes,
      estado: estaAgotado ? 'Agotado' : estaPorAgotarse ? 'Por agotarse' : 'Disponible',
      fecha_vencimiento: new Date(serie.fecha_vencimiento).toLocaleDateString('es-DO'),
    };
  })

  const columns = [
    { key: 'rango', label: 'Rango', width: '12%', maxWidth: '120px' },
    { key: 'tipo_comprobante', label: 'Tipo de Comprobante', width: '20%', maxWidth: '200px' },
    { key: 'numero_actual', label: 'Número Actual', width: '12%', maxWidth: '140px' },
    { key: 'restantes', label: 'Restantes', width: '10%', maxWidth: '120px' },
    { key: 'estado', label: 'Estado', width: '13%', maxWidth: '140px' },
    { key: 'fecha_vencimiento', label: 'Fecha Vencimiento', width: '18%', maxWidth: '180px' },
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
          title="Series de Comprobante"
        />
    </div>
  )
}

export default ComprobantesList
