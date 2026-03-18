import type { IPaginationRequest } from '@/composables/usePagination'

type TLocale = 'th' | 'en'

export interface IBasePaginationRequest extends IPaginationRequest {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  locale?: TLocale
}
