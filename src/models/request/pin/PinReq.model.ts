import type { IBasePaginationRequest } from '../Request.model'

/**
 * `GET /v1/pins/`. `?active=true` is the contractor's picker: only pins that are themselves
 * active AND on a currently-active plan (wayfinder 104). `?planId=` narrows to one plan — the
 * picker asks for the full active set on the chosen plan in one page, an explicit `limit: 9999`
 * (`PinPicker.vue`) rather than relying on the server's default page size of 10.
 */
export interface IGetPinListQuery extends IBasePaginationRequest {
  planId?: number
  active?: boolean
}
