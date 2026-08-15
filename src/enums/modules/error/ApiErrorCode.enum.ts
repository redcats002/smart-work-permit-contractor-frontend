/**
 * Machine-readable error codes the backend returns in a structured error
 * response (`{ code, ... }`). The backend doc lists these as "e.g." — the set
 * is open, not closed. Add a member here only when the backend doc / a real
 * endpoint names a new code; anything else falls back to `error.unknown` in
 * `useApiError` without needing a code change here.
 */
export enum EApiErrorCode {
  GAS_OUT_OF_RANGE = 'GAS_OUT_OF_RANGE',
  ENTRANTS_STILL_INSIDE = 'ENTRANTS_STILL_INSIDE',
  CERT_EXPIRED = 'CERT_EXPIRED',
  FIRE_WATCH_NOT_ELAPSED = 'FIRE_WATCH_NOT_ELAPSED'
}

export type TApiErrorCode = `${EApiErrorCode}`
