// One entry per member of EApiErrorCode (docs/main/dev-handoff/04-api-contract.md §5), plus the
// `unknown` fallback used for any response that carries no errorCode — a 404, an ownership 403, a
// validation 400, or a transport failure. The backend's own `message` is never rendered.
const error = {
  // Submit-time reading validation
  LEL_MISSING: 'The LEL reading is required for this permit type. Record it before submitting.',
  O2_MISSING: 'The O₂ reading is required for this permit type. Record it before submitting.',
  CO_MISSING: 'The CO reading is required for Confined Space work. Record it before submitting.',
  WIND_MISSING: 'The wind speed reading is required for Working at Heights. Record it before submitting.',
  GAS_OUT_OF_RANGE: 'A gas reading is outside the safe range. Correct the atmosphere and re-test before submitting.',
  WIND_OUT_OF_RANGE: 'Wind speed is above the 25 km/h limit for Working at Heights.',

  // Certificate gate
  CERT_MISSING: 'A registered worker has no certificate on file. Add it before submitting.',
  CERT_EXPIRED: 'A registered worker has an expired certificate. This cannot be overridden.',

  // Permit state machine
  PERMIT_NOT_EDITABLE: 'This permit can no longer be edited — it has already left draft.',
  PERMIT_NOT_SUBMITTABLE: 'This permit cannot be submitted in its current state.',
  PERMIT_NOT_ACTIVE: 'This action is only available while the permit is active.',
  NOT_HOT_WORK: 'Fire Watch applies to Hot Work permits only.',

  // Closure guards
  ENTRANTS_STILL_INSIDE: 'Closure blocked — one or more entrants are still checked in.',
  FIRE_WATCH_NOT_ELAPSED: 'Closure is locked until the 30-minute Fire Watch countdown ends.',
  PERMIT_NOT_CLOSABLE: 'This permit cannot be closed in its current state.',
  PERMIT_NOT_PENDING: 'This permit is no longer awaiting review.',

  // QR
  INVALID_QR_TOKEN: 'This QR code is not valid.',
  RATE_LIMITED: 'Too many attempts. Wait a moment and try again.',

  // Auth
  UNAUTHENTICATED: 'Your session has expired. Please sign in again.',
  FORBIDDEN_ROLE: 'Your account does not have permission to do this.',
  USER_ALREADY_EXISTS: 'An account with that email already exists.',

  unknown: 'Something went wrong. Please try again.'
}

export default error
