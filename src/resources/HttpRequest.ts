import axios, { type AxiosInstance } from 'axios'
import { onRequest, onRequestError, onResponse, onResponseError } from './Interceptors'
import { getAuthToken } from '@/utils/Auth'

interface IHttpRequest {
  axiosInstance: AxiosInstance
  setAuthHeader(): void
  setHeader(data: ISetHeader): void
  get(endPoint: string, data: object, config?: object): Promise<any>
  download(endPoint: string, data?: object): Promise<any>
  post(endPoint: string, data: object, config?: object): Promise<any>
  put(endPoint: string, data: object, config?: object): Promise<any>
  patch(endPoint: string, data: object, config?: object): Promise<any>
  delete(endPoint: string, params?: object, data?: object): Promise<any>
}

export interface ISetHeader {
  key: string
  value: any
}

class HttpRequest implements IHttpRequest {
  private url: string

  public axiosInstance: AxiosInstance

  constructor (url?: string) {
    if (url) {
      this.url = url
    } else {
      this.url = import.meta.env.VITE_APP_API_URL || ''
    }

    this.axiosInstance = axios.create({
      baseURL: this.url,
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.axiosInstance.interceptors.request.use((config: any): any => onRequest(config), onRequestError)

    this.axiosInstance.interceptors.response.use(onResponse, onResponseError)
  }

  public setAuthHeader (): void {
    const authHeader: ISetHeader | null = getAuthToken()
    if (authHeader) {
      this.setHeader(authHeader)
    }
  }

  public setHeader (data: ISetHeader): void {
    if (data.key && data.value) {
      this.axiosInstance.defaults.headers.common[data.key] = data.value
    }
  }

  public get (endPoint: string, data?: object, config?: object): Promise<any> {
    return this.axiosInstance.get(endPoint, {
      params: data,
      ...config
    })
  }

  public download (endPoint: string, data?: object): Promise<any> {
    return this.axiosInstance.get(endPoint, {
      params: data,
      responseType: 'blob'
    })
  }

  public post (endPoint: string, data: object, config?: object): Promise<any> {
    return this.axiosInstance.post(endPoint, data, config)
  }

  public put (endPoint: string, data: object, config?: object): Promise<any> {
    return this.axiosInstance.put(endPoint, data, config)
  }

  public patch (endPoint: string, data: object, config?: object): Promise<any> {
    return this.axiosInstance.patch(endPoint, data, config)
  }

  public delete (endPoint: string, params?: object, data?: object): Promise<any> {
    return this.axiosInstance.delete(endPoint, {
      params,
      data
    })
  }
}

export default HttpRequest
