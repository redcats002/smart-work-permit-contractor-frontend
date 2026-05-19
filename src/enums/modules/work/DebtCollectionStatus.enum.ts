export enum DebtCollectionStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export type TDebtCollectionStatus = keyof typeof DebtCollectionStatusEnum
