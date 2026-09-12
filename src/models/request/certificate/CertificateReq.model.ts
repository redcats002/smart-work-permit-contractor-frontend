import type { IBasePaginationRequest } from '../Request.model'

/**
 * GET /certificates. `search` is a fuzzy match on the worker's name (server-side — see
 * `list.service.ts` in the api). `workerId` is the exact-match sibling: "this worker's
 * certificates only", used by the list page's worker filter (wayfinder 110).
 */
export interface IGetCertificateListQuery extends IBasePaginationRequest {
  workerId?: number
}

/** POST /certificates */
export interface ICreateCertificatePayload {
  /** wayfinder 060 — a worker is a record. `workerName`/`role` are no longer accepted here. */
  workerId: number
  certType: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  issuedDate: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  expiryDate: string
  /**
   * Storage **path** (`filePath`) returned by Upload.provider, if a file was attached.
   *
   * Never the presigned `fileUrl` — that handle expires 60 seconds after upload
   * (REVIEW-2026-08-19 S4), so persisting it stores a dead link.
   *
   * Accepted by the API since wayfinder 056 — `docs/api/GAPS.md` row G is closed. Before that
   * the field was stripped silently and every uploaded file was orphaned in object storage.
   */
  filePath?: string
  /** wayfinder 095/115 — a certificate needs `licenceNo` OR `filePath`, at least one; enforced
   * server-side (`CERT_LICENCE_OR_ATTACHMENT_REQUIRED`), mirrored client-side for feedback. */
  licenceNo?: string
  description?: string
}

/** PATCH /certificates/:id */
export interface IUpdateCertificatePayload {
  /** Re-points the certificate at a different worker. Fixing a NAME is a Worker rename, not this. */
  workerId?: number
  certType?: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  issuedDate?: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  expiryDate?: string
  /**
   * Three distinct cases, which is why this is `string | null` and optional rather than just
   * optional: **omitted** keeps the current attachment, a **string** replaces it, and an explicit
   * **null** detaches it. An optional string alone could not express the third, and "omitted means
   * keep" is the whole contract of the edit form's empty file input.
   */
  filePath?: string | null
  /**
   * wayfinder 095/115. **Omit when untouched** — the same discipline 045 established for
   * `areaId`: a value that merely arrived from hydrate is display state, not outgoing payload.
   * The server only re-checks the one-of rule (`CERT_LICENCE_OR_ATTACHMENT_REQUIRED`) when the
   * patch body touches `licenceNo` or `filePath`, so a form that round-trips its whole model
   * would trip that error on every pre-095 certificate that has neither. Unlike `filePath` there
   * is no `null` variant on the wire for these two (docs/api/openapi.json) — clearing one means
   * sending an empty string, not `null`.
   */
  licenceNo?: string
  description?: string
}
