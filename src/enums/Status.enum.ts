export enum EntityStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

export type TEntityStatus = keyof typeof EntityStatusEnum
