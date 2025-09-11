import api from './api'

const ProductosApi = {
    getAll: async () => {
        const response = await api.get('/productos/')
        return response.data
    },
    getById: async (id) => {
        const response = await api.get(`/productos/${id}`)
        return response.data
    },
    create: async (producto) => {
        const response = await api.post('/productos/', producto)
        return response.data
    },
    update: async (id, producto) => {
        const response = await api.put(`/productos/${id}`, producto)
        return response.data
    },
    delete: async (id) => {
        const response = await api.delete(`/productos/${id}`)
        return response.data
    }
}

export default ProductosApi;
