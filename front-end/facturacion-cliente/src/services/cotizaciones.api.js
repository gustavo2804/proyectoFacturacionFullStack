import api from './api';
// API para Cotizaciones
const CotizacionesApi = {
  getAll: async () => {
    try {
      const response = await api.get(`/cotizaciones/`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/cotizaciones/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cotización:', error);
      throw error;
    }
  },

  create: async (cotizacion) => {
    try {
      const response = await api.post(`/cotizaciones/`, cotizacion);
      return response.data;
    } catch (error) {
      console.error('Error al crear cotización:', error);
      throw error;
    }
  },

  update: async (id, cotizacion) => {
    try {
      const response = await api.put(`/cotizaciones/${id}/`, cotizacion);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cotización:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/cotizaciones/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cotización:', error);
      throw error;
    }
  }
};

// API para Detalles de Cotización
const DetalleCotizacionApi = {
  getByCotizacionId: async (cotizacionId) => {
    try {
      const response = await api.get(`/detalle-cotizaciones/?cotizacion=${cotizacionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles de cotización:', error);
      throw error;
    }
  },

  create: async (detalle) => {
    try {
      const response = await api.post(`/detalle-cotizaciones/`, detalle);
      return response.data;
    } catch (error) {
      console.error('Error al crear detalle de cotización:', error);
      throw error;
    }
  },

  update: async (id, detalle) => {
    try {
      const response = await api.put(`/detalle-cotizaciones/${id}/`, detalle);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar detalle de cotización:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/detalle-cotizaciones/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar detalle de cotización:', error);
      throw error;
    }
  }
};

export default CotizacionesApi;
export { DetalleCotizacionApi };
