/**
 * The complete machine-readable vocabulary the backend emits, in the `errorCode` field of its
 * error body (`{ code: <http status>, message, errorCode? }`) — see
 * docs/main/dev-handoff/04-api-contract.md §5, generated from docs/api/openapi.json.
 *
 * This is a CLOSED set: it is every code the backend can send, not an "e.g." list. 404s,
 * ownership 403s and request-validation 400s deliberately carry NO code — their absence is
 * normal, and `useApiError` falls back for them.
 *
 * Codes a contractor account can actually hit are marked; the rest exist so a shared error
 * surface never renders a backend-authored sentence just because the code was unrecognized.
 */
export enum EApiErrorCode {
  // Submit-time reading validation (contractor) — POST /permits/:id/submit answers 400 with the
  // first failure; the backend's `message` joins every failure with '; ' and must not be rendered.
  LEL_MISSING = 'LEL_MISSING',
  O2_MISSING = 'O2_MISSING',
  CO_MISSING = 'CO_MISSING',
  WIND_MISSING = 'WIND_MISSING',
  GAS_OUT_OF_RANGE = 'GAS_OUT_OF_RANGE',
  WIND_OUT_OF_RANGE = 'WIND_OUT_OF_RANGE',

  // Certificate gate (contractor)
  CERT_MISSING = 'CERT_MISSING',
  CERT_EXPIRED = 'CERT_EXPIRED',

  // Permit state machine (contractor)
  PERMIT_NOT_EDITABLE = 'PERMIT_NOT_EDITABLE',
  PERMIT_NOT_SUBMITTABLE = 'PERMIT_NOT_SUBMITTABLE',
  PERMIT_NOT_ACTIVE = 'PERMIT_NOT_ACTIVE',
  NOT_HOT_WORK = 'NOT_HOT_WORK',

  // Closure guards — safety-officer actions, surfaced here because a contractor watching a permit
  // needs to understand why it has not closed.
  ENTRANTS_STILL_INSIDE = 'ENTRANTS_STILL_INSIDE',
  FIRE_WATCH_NOT_ELAPSED = 'FIRE_WATCH_NOT_ELAPSED',
  PERMIT_NOT_CLOSABLE = 'PERMIT_NOT_CLOSABLE',
  PERMIT_NOT_PENDING = 'PERMIT_NOT_PENDING',

  // QR
  INVALID_QR_TOKEN = 'INVALID_QR_TOKEN',
  RATE_LIMITED = 'RATE_LIMITED',

  // Auth / provisioning
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  FORBIDDEN_ROLE = 'FORBIDDEN_ROLE',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS'
}

export type TApiErrorCode = `${EApiErrorCode}`

/** Runtime list, so a test can drive the whole vocabulary from one place. */
export const API_ERROR_CODES: TApiErrorCode[] = Object.values(EApiErrorCode)
