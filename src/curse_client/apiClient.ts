import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.curseforge.com',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY
  }
})

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get(url, config)
  return response.data
}

export async function post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post(url, data, config)
  return response.data
}

export async function put<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.put(url, data, config)
  return response.data
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.delete(url, config)
  return response.data
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Ошибка API:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)
