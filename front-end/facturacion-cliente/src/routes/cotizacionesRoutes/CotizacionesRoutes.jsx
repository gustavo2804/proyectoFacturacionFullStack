import { Routes, Route } from 'react-router-dom'
import CotizacionesList from '../../pages/Cotizaciones/CotizacionesList'
import CotizacionesDetails from '../../pages/Cotizaciones/CotizacionesDetails'

const CotizacionesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CotizacionesList />} />
      <Route path="/nueva" element={<CotizacionesDetails />} />
      <Route path="/:id" element={<CotizacionesDetails />} />
    </Routes>
  )
}

export default CotizacionesRoutes
