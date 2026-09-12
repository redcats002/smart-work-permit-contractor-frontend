import type { IBaseSuccessResponse } from '@/models/response/Response.model'

/**
 * `GET /permits/:id/entrants` row. **Currently-inside workers only** — the last event per worker,
 * filtered to direction IN (`getCurrentlyInsideWorkers`) — never a full in/out history. Own-permit
 * scoped for a contractor (map ruling 18 / wayfinder 112, "was unscoped" leak closed).
 */
export interface IEntrantRegisterEntry {
  workerId: number
  workerName: string
  checkedInAt: string
}

export type TGetEntrantListResponse = IBaseSuccessResponse<IEntrantRegisterEntry[]>
