import api from './api'

const Authapi={
    login:async(data)=>{
        const response=await api.post('/token/',data)
        return response.data
    },
    logout:async(data)=>{
        const response=await api.post('/logout/',data)
        return response.data
    },
    register:async(data)=>{
        const response=await api.post('/register/',data)
        return response.data
    },
    isAuthenticated:async(data)=>{
        const response=await api.post('/is-authenticated/',data)
        return response.data
    },
    refreshToken:async(data)=>{
        const response=await api.post('/token/refresh/',data)
        return response.data
    }
}

export default Authapi;

