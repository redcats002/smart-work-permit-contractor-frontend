import type { IPagination } from '@/composables/usePagination'

export type TBaseParamsId = number | string | string[]

export interface IBaseSuccessResponse<T = any> {
  message: string
  data: T
}

export interface IBasePaginationResponse<T = any> extends IBaseSuccessResponse<T[]>, IPagination {}

export interface IErrorResponse {
  code: number
  message: string
}
export type TErrorResponse = IErrorResponse | string | any
