export enum EPermitType {
  HOT = 'hot',
  CONFINED = 'confined',
  HEIGHTS = 'heights'
}

export type TPermitType = `${EPermitType}`

export interface IPermitTypeOption {
  /** i18n key under permit.type.* — resolve via t(), never render raw. */
  labelKey: string
  value: TPermitType
}

export const PermitTypeItems: IPermitTypeOption[] = Object.values(EPermitType).map(
  (e: TPermitType): IPermitTypeOption => ({
    labelKey: `permit.type.${e}`,
    value: e
  })
)
