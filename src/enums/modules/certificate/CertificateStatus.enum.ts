/**
 * Validity state of a personnel certificate — derived from `expiryDate` by
 * src/utils/CertificateStatus.ts, never re-derived ad hoc in a component.
 */
export enum ECertificateStatus {
  VALID = 'VALID',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED'
}

export type TCertificateStatus = keyof typeof ECertificateStatus
