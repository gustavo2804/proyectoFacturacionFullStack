import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import ClientesRoutes from './clienteRoutes/ClientesRoutes'
import FacturasRoutes from './facturaRoutes/FacturasRoutes'
import ProductosRoutes from './productosRoutes/ProductosRoutes'
import ComprobantesRoutes from './comprobantesRoutes/ComprobantesRoutes'
import CotizacionesRoutes from './cotizacionesRoutes/CotizacionesRoutes'
import ConfigurationPage from '../pages/Configuracion/ConfigurationPage'

const AppRouter = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/productos/*' element={<ProductosRoutes />} />
        <Route path='/comprobantes/*' element={<ComprobantesRoutes />} />
        <Route path='/facturas/*' element={<FacturasRoutes />} />
        <Route path='/clientes/*' element={<ClientesRoutes />} />
        <Route path='/cotizaciones/*' element={<CotizacionesRoutes />} />
        <Route path='/configuracion' element={<ConfigurationPage />} />
    </Routes>
  )
}

export default AppRouter