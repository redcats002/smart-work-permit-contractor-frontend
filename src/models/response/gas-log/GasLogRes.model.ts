import type { IBaseSuccessResponse } from '@/models/response/Response.model'

/**
 * `GET /permits/:id/gas-log` row. Own-permit scoped for a contractor (map ruling 18 / wayfinder
 * 112, "was unscoped" leak closed).
 *
 * `dueAt` is server-computed per-entry (`computeGasReadingStatus(entry.recordedAt).dueAt`) —
 * never recompute the retest interval client-side. Nullable because the underlying model column
 * is nullable server-side even though every live row carries one.
 */
export interface IGasLogEntryWire {
  id: number
  permitId: string
  lel: number | null
  o2: number | null
  co: number | null
  so2: number | null
  tester: string
  recordedById: string
  recordedAt: string
  offlineClientId?: string | null
  createdAt: string
  dueAt: string | null
}

/** `{ message, data, overdue }` — `overdue` rides alongside `data`, not nested inside it. */
export interface IGetGasLogListResponse extends IBaseSuccessResponse<IGasLogEntryWire[]> {
  overdue: boolean
}
