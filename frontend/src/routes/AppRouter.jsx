import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'
import ClientesRoutes from './clienteRoutes/ClientesRoutes'
import FacturasRoutes from './facturaRoutes/FacturasRoutes'
import ProductosRoutes from './productosRoutes/ProductosRoutes'
import ComprobantesRoutes from './comprobantesRoutes/ComprobantesRoutes'
import CotizacionesRoutes from './cotizacionesRoutes/CotizacionesRoutes'
import ConfigurationPage from '../pages/Configuracion/ConfigurationPage'
import ProtectedRoute from '../components/ProtectedRoute'

const AppRouter = () => {
  return (
    <Routes>
        {/* Rutas públicas */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        
        {/* Rutas protegidas */}
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/productos/*' element={
          <ProtectedRoute>
            <ProductosRoutes />
          </ProtectedRoute>
        } />
        <Route path='/comprobantes/*' element={
          <ProtectedRoute>
            <ComprobantesRoutes />
          </ProtectedRoute>
        } />
        <Route path='/facturas/*' element={
          <ProtectedRoute>
            <FacturasRoutes />
          </ProtectedRoute>
        } />
        <Route path='/clientes/*' element={
          <ProtectedRoute>
            <ClientesRoutes />
          </ProtectedRoute>
        } />
        <Route path='/cotizaciones/*' element={
          <ProtectedRoute>
            <CotizacionesRoutes />
          </ProtectedRoute>
        } />
        <Route path='/configuracion' element={
          <ProtectedRoute>
            <ConfigurationPage />
          </ProtectedRoute>
        } />
    </Routes>
  )
}

export default AppRouter