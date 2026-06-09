import axios, { type AxiosInstance } from 'axios'
import type { ActionLogMenu } from '@/enums/modules/action-log/ActionLogMenu.enum'
import { onRequest, onRequestError, onResponse, onResponseError } from './Interceptors'

export interface IActionLogHeaders {
  menu: ActionLogMenu
  subMenu?: string
}

interface IHttpRequest {
  axiosInstance: AxiosInstance
  setHeader(data: ISetHeader): void
  get(endPoint: string, data?: object, config?: object): Promise<any>
  download(endPoint: string, data?: object): Promise<any>
  post(endPoint: string, data?: object, config?: object): Promise<any>
  put(endPoint: string, data: object, config?: object): Promise<any>
  patch(endPoint: string, data?: object, config?: object): Promise<any>
  delete(endPoint: string, params?: object, data?: object, config?: object): Promise<any>
}

export interface ISetHeader {
  key: string
  value: any
}

class HttpRequest implements IHttpRequest {
  private url: string

  private _logHeaders: Record<string, string> = {}

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
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.axiosInstance.interceptors.request.use((config: any): any => {
      Object.assign(config.headers, this._logHeaders)
      this._logHeaders = {}
      if (config.url) config.headers['x-current-path'] = encodeURIComponent(config.url)
      const payload: unknown = config.params ?? config.data
      if (payload != null) {
        config.headers['x-current-payload'] = typeof payload === 'string' ? encodeURIComponent(payload) : encodeURIComponent(JSON.stringify(payload))
      }
      return onRequest(config)
    }, onRequestError)

    this.axiosInstance.interceptors.response.use(onResponse, onResponseError)
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

  public post (endPoint: string, data?: object, config?: object): Promise<any> {
    return this.axiosInstance.post(endPoint, data, config)
  }

  public put (endPoint: string, data: object, config?: object): Promise<any> {
    return this.axiosInstance.put(endPoint, data, config)
  }

  public patch (endPoint: string, data?: object, config?: object): Promise<any> {
    return this.axiosInstance.patch(endPoint, data, config)
  }

  public delete (endPoint: string, params?: object, data?: object, config?: object): Promise<any> {
    return this.axiosInstance.delete(endPoint, {
      params,
      data,
      ...config
    })
  }

  protected setLogHeaders (opts: IActionLogHeaders): void {
    this._logHeaders = { 'x-current-menu': opts.menu }
    if (opts.subMenu) this._logHeaders['x-current-sub-menu'] = encodeURIComponent(opts.subMenu)
  }
}

export default HttpRequest
