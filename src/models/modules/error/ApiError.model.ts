/**
 * The backend's error body (docs/main/dev-handoff/04-api-contract.md §1):
 *
 *   { "code": 403, "message": "Fire Watch has not elapsed", "errorCode": "FIRE_WATCH_NOT_ELAPSED" }
 *
 * `code` is the **HTTP status**, not a discriminator — the machine-readable code lives in
 * `errorCode`, and is absent on 404s, ownership 403s and validation 400s.
 *
 * `message` is backend-authored English and must never be rendered to a user; localize off
 * `errorCode` — see AGENTS.md "Business rules that must not drift".
 */
export interface IApiErrorResponse {
  code: number
  message?: string
  errorCode?: string
}
