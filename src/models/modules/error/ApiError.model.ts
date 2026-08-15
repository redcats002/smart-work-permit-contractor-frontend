/**
 * Detail payload shape varies per error code and the backend doc does not pin
 * it down (e.g. `GAS_OUT_OF_RANGE` needs to say which readings failed,
 * `ENTRANTS_STILL_INSIDE` needs the entrant count/names). Keep it loose
 * rather than inventing a rigid per-code schema the backend has not
 * promised — callers that know a specific code's shape can cast narrowly.
 */
export type TApiErrorDetail = Record<string, unknown>

/**
 * Structured error body the backend returns instead of a locale-baked
 * message. `code` is the machine-readable discriminator the client localizes
 * (`error.<CODE>`); `message`, when present, is backend-authored and must
 * never be rendered to the user — see AGENTS.md "Business rules that must
 * not drift".
 */
export interface IApiErrorResponse {
  code: string
  message?: string
  details?: TApiErrorDetail
}
