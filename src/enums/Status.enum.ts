export enum EntityStatusEnum {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  DELETED = 'DELETED'
}

export type TEntityStatus = keyof typeof EntityStatusEnum
