import axios from 'axios'
import store from '@/store'

const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000
})

service.interceptors.request.use(config => config, error => {
    console.warn(`[request error info] ${error}`)
    Promise.reject(error)
})

service.interceptors.response.use(response => response, error => {
    console.warn(`[response error info] ${error}`)
    return Promise.reject(error)
})

export default service
