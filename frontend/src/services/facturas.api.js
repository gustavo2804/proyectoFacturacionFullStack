import api from './api'

const FacturasApi = {
    getAll: async () => {
        const response = await api.get('/facturas/')
        return response.data
    },
    getById: async (id) => {
        const response = await api.get(`/facturas/${id}/`)
        return response.data
    },
    create: async (factura) => {
        const response = await api.post('/facturas/', factura)
        return response.data
    },
    update: async (id, factura) => {
        const response = await api.put(`/facturas/${id}/`, factura)
        return response.data
    },
    delete: async (id) => {
        const response = await api.delete(`/facturas/${id}/`)
        return response.data
    }
}

// Servicio para productos (necesario para los artículos)
const ProductosApi = {
    getAll: async () => {
        const response = await api.get('/productos/')
        return response.data
    },
    getById: async (id) => {
        const response = await api.get(`/productos/${id}`)
        return response.data
    }
}

// Servicio para detalles de factura
const DetalleFacturaApi = {
    getByFacturaId: async (facturaId) => {
        const response = await api.get(`detalle-facturas/?factura=${facturaId}`)
        return response.data
    },
    create: async (detalle) => {
        const response = await api.post('detalle-facturas/', detalle)
        return response.data
    },
    update: async (id, detalle) => {
        const response = await api.put(`detalle-facturas/${id}/`, detalle)
        return response.data
    },
    delete: async (id) => {
        const response = await api.delete(`detalle-facturas/${id}/`)
        return response.data
    }
}

export { FacturasApi, ProductosApi, DetalleFacturaApi }
export default FacturasApi;
