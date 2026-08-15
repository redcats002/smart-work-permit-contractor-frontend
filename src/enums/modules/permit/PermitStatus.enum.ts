export enum EPermitStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  FIRE_MONITOR = 'FIRE_MONITOR',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED'
}

export type TPermitStatus = keyof typeof EPermitStatus

export interface IPermitStatusOption {
  /** i18n key under permit.status.* — resolve via t(), never render raw. */
  labelKey: string
  value: TPermitStatus
}

export const PermitStatusItems: IPermitStatusOption[] = Object.values(EPermitStatus).map(
  (e: TPermitStatus): IPermitStatusOption => ({
    labelKey: `permit.status.${e}`,
    value: e
  })
)
