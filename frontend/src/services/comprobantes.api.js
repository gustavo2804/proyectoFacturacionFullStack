import api from './api'

const ComprobantesApi = {
    getAll: async () => {
        const response = await api.get('/comprobantes/')
        return response.data
    },
    getById: async (id) => {
        const response = await api.get(`/comprobantes/${id}`)
        return response.data
    },
    create: async (comprobante) => {
        const response = await api.post('/comprobantes/', comprobante)
        return response.data
    },
    update: async (id, comprobante) => {
        const response = await api.put(`/comprobantes/${id}`, comprobante)
        return response.data
    },
    delete: async (id) => {
        const response = await api.delete(`/comprobantes/${id}`)
        return response.data
    },
    getDisponibles: async (tipoComprobanteId) => {
        const response = await api.get(`/comprobantes/disponibles/?tipo_comprobante=${tipoComprobanteId}`)
        return response.data
    }
}

// Servicio para tipos de comprobante
const TipoComprobantesApi = {
    getAll: async () => {
        const response = await api.get('/tipocomprobantes/')
        return response.data
    },
    getById: async (id) => {
        const response = await api.get(`/tipocomprobantes/${id}`)
        return response.data
    },
    create: async (tipoComprobante) => {
        // El backend asigna automáticamente el id_empresa desde el middleware
        const response = await api.post('/tipocomprobantes/', tipoComprobante)
        return response.data
    },
    update: async (id, tipoComprobante) => {
        // El backend asigna automáticamente el id_empresa desde el middleware
        const response = await api.put(`/tipocomprobantes/${id}`, tipoComprobante)
        return response.data
    },
    delete: async (id) => {
        const response = await api.delete(`/tipocomprobantes/${id}`)
        return response.data
    }
}

// Servicio para series de comprobante
const SerieComprobantesApi = {
    getAll: async () => {
        const response = await api.get('/seriecomprobantes/')
        return response.data
    },
    getById: async (id) => {
        const response = await api.get(`/seriecomprobantes/${id}`)
        return response.data
    },
    create: async (serieComprobante) => {
        const response = await api.post('/seriecomprobantes/', serieComprobante)
        return response.data
    },
    update: async (id, serieComprobante) => {
        const response = await api.put(`/seriecomprobantes/${id}`, serieComprobante)
        return response.data
    },
    delete: async (id) => {
        const response = await api.delete(`/seriecomprobantes/${id}`)
        return response.data
    },
    anular: async (id) => {
        const response = await api.post(`/seriecomprobantes/${id}/anular/`)
        return response.data
    },
    getAlertas: async (limite = 5) => {
        const response = await api.get(`/seriecomprobantes/alertas/?limite=${limite}`)
        return response.data
    }
}

export { ComprobantesApi, TipoComprobantesApi, SerieComprobantesApi }
export default ComprobantesApi;

