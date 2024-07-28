import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const apiRequest = async (
  method: string,
  url: string,
  data: null | object,
  params: null | object
) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params
    })
    return response.data
  } catch (error) {
    console.error(`Error en la petición ${method.toUpperCase()} ${url}:`, error)
    toast.error('Hubo un error en la petición!', {
      autoClose: 1000
    })
    throw error
  }
}
