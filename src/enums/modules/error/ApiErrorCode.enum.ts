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
  CERT_LICENCE_OR_ATTACHMENT_REQUIRED = 'CERT_LICENCE_OR_ATTACHMENT_REQUIRED',
  PPE_REQUIRED = 'PPE_REQUIRED',

  // Worker register (contractor) — wayfinder 060. Not a failure the user must recover from:
  // the response carries `workerId`, so an inline "Create worker …" selects the existing
  // worker instead of showing this at all. The string exists for the paths that cannot.
  WORKER_ALREADY_EXISTS = 'WORKER_ALREADY_EXISTS',

  // Permit state machine (contractor)
  PERMIT_NOT_EDITABLE = 'PERMIT_NOT_EDITABLE',
  PERMIT_NOT_SUBMITTABLE = 'PERMIT_NOT_SUBMITTABLE',
  PERMIT_NOT_ACTIVE = 'PERMIT_NOT_ACTIVE',
  NOT_HOT_WORK = 'NOT_HOT_WORK',
  // wayfinder 022 — PATCH /permits/:id refuses a body with no editable field at all, so an
  // empty-body PATCH can never withdraw a PENDING permit by accident (e.g. an editability probe).
  PERMIT_UPDATE_EMPTY = 'PERMIT_UPDATE_EMPTY',
  // feat-023 — position on the facility plan. Submit refuses with this once an active plan
  // exists and the permit has no planId/planX/planY set.
  PERMIT_POSITION_REQUIRED = 'PERMIT_POSITION_REQUIRED',

  // Closure guards — safety-officer actions, surfaced here because a contractor watching a permit
  // needs to understand why it has not closed.
  ENTRANTS_STILL_INSIDE = 'ENTRANTS_STILL_INSIDE',
  CLOSURE_REASON_REQUIRED = 'CLOSURE_REASON_REQUIRED',
  FIRE_WATCH_NOT_ELAPSED = 'FIRE_WATCH_NOT_ELAPSED',
  PERMIT_NOT_CLOSABLE = 'PERMIT_NOT_CLOSABLE',
  PERMIT_NOT_PENDING = 'PERMIT_NOT_PENDING',

  // QR
  INVALID_QR_TOKEN = 'INVALID_QR_TOKEN',
  RATE_LIMITED = 'RATE_LIMITED',

  // Auth / provisioning
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  FORBIDDEN_ROLE = 'FORBIDDEN_ROLE',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  // Account lifecycle (feat-022, 2026-08-23). Accounts are deactivated, never deleted, so a
  // refused sign-in or a refused request can mean "this account was switched off" rather than
  // "wrong credentials" or "wrong role" — the two must not read the same to the user.
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED',
  LAST_SAFETY_OFFICER = 'LAST_SAFETY_OFFICER',

  // File upload (contractor) — POST /files. Added by the backend's 2026-08-19 upload-hardening
  // pass (GAPS.md V3/V4). Enforcement is server-side, so a violation comes back as a coded 400
  // rather than a schema-validation error, and the certificate/photo pickers must surface it.
  FILE_TYPE_NOT_ALLOWED = 'FILE_TYPE_NOT_ALLOWED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UPLOAD_FOLDER_NOT_ALLOWED = 'UPLOAD_FOLDER_NOT_ALLOWED',
  STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE',

  // Area (wayfinder 034/036) — a contractor proposes an area (POST /areas) and it is unusable by
  // any permit until a safety officer approves it. AREA_NOT_APPROVED is a contractor-visible 400
  // from POST/PATCH /permits when the referenced area is still PENDING or was REJECTED.
  // AREA_NOT_PENDING is the officer-only approve/reject race guard, surfaced here only so a
  // contractor UI polling area status never renders the backend's raw message. AREA_REQUIRED is
  // the PERMIT_AREA_REQUIRED-flag submit gate, off by default.
  AREA_NOT_APPROVED = 'AREA_NOT_APPROVED',
  AREA_NOT_PENDING = 'AREA_NOT_PENDING',
  AREA_REQUIRED = 'AREA_REQUIRED'
}

export type TApiErrorCode = `${EApiErrorCode}`

/** Runtime list, so a test can drive the whole vocabulary from one place. */
export const API_ERROR_CODES: TApiErrorCode[] = Object.values(EApiErrorCode)
